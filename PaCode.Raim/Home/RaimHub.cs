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

        public void Register(string name)
        {
            name = HttpUtility.HtmlEncode(name);

            var player = arena.RegisterPlayer(name);
            players.Add(Context.ConnectionId, player);

            Clients.Caller.SignedIn(player.Id);
            Clients.All.Registered(player);
            Clients.Caller.OtherPlayers(players.Values.Where(p => p.Name != name));

            UpdateGameState();
            Clients.All.PlayerMoved(arena.GameObjects);
        }

        public void SignOff()
        {
            var player = players[Context.ConnectionId];
            players.Remove(Context.ConnectionId);
            arena.GameObjects.RemoveAll(g => player.Bullets.Any(b => b.Id == g.Id));
            arena.GameObjects.RemoveAll(g => g.Id == player.Id);
            Clients.All.SignedOff(player.Name);

            UpdateGameState();
            Clients.All.PlayerMoved(arena.GameObjects);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            SignOff();
            return base.OnDisconnected(stopCalled);
        }

        public void PlayerMoving(PlayerInput input)
        {
            var updateTime = DateTime.Now;
            UpdateGameState(updateTime);
            var player = players[Context.ConnectionId];
            var createdObjects = player.ProcessInput(input, updateTime);
            arena.GameObjects.AddRange(createdObjects);
            Clients.All.PlayerMoved(arena.GameObjects);
        }

        private void UpdateGameState(DateTime? updateTimestamp = null)
        {
            arena.UpdatePositions(updateTimestamp);
            arena.CalculateCollisions();

            arena.GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);
        }

    }
}