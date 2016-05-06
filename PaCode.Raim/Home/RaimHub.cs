using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Nancy.Helpers;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        private static Dictionary<string, Player> players = new Dictionary<string, Player>();
        private static Arena arena = new Arena();

        public RaimHub()
        {
            arena.ArenaChanged += Arena_ArenaChanged;
        }

        protected override void Dispose(bool disposing)
        {
            arena.ArenaChanged -= Arena_ArenaChanged;
            base.Dispose(disposing);
        }

        private void Arena_ArenaChanged(object sender, EventArgs e)
        {
            Clients.All.PlayerMoved(arena.GameObjects);
        }

        public void Register(string name)
        {
            name = HttpUtility.HtmlEncode(name);

            var player = arena.RegisterPlayer(name);
            players.Add(Context.ConnectionId, player);

            Clients.Caller.SignedIn(player.Id);
            Clients.All.Registered(player);
            Clients.Caller.OtherPlayers(players.Values.Where(p => p.Name != name));
        }

        public void SignOff()
        {
            var player = players[Context.ConnectionId];
            players.Remove(Context.ConnectionId);

            arena.UnregisterPlayer(player);
            Clients.All.SignedOff(player.Name);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            SignOff();
            return base.OnDisconnected(stopCalled);
        }

        public void PlayerMoving(PlayerInput input)
        {
            var updateTime = DateTime.Now;
            arena.UpdatePositions(updateTime);
            arena.ProcessInput(input, players[Context.ConnectionId]);
        }
    }
}