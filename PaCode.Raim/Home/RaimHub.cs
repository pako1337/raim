using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Nancy.Helpers;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        private static Dictionary<string, Player> players = new Dictionary<string, Player>();
        public static Arena arena;
        private static ArenaTicker _ticker;
        private static SpinLock _lock = new SpinLock();

        public void Register(string name)
        {
            if (arena == null)
            {
                var gotLock = false;
                try
                {
                    _lock.Enter(ref gotLock);
                    if (arena == null)
                    {
                        arena = new Arena();
                        _ticker = ArenaTicker.Instance;
                    }

                }
                finally
                {
                    if (gotLock) _lock.Exit();
                }
            }

            name = HttpUtility.HtmlEncode(name);

            var player = arena.RegisterPlayer(name);
            players.Add(Context.ConnectionId, player);

            Clients.Caller.SignedIn(player.Id);
            Clients.Caller.SetupArena(arena);
            Clients.All.Registered(player);
            Clients.Caller.OtherPlayers(players.Values.Where(p => p.Name != name));
        }

        public void SignOff()
        {
            var player = players[Context.ConnectionId];
            players.Remove(Context.ConnectionId);

            arena.UnregisterPlayer(player);
            Clients.All.SignedOff(player);

            if (players.Count == 0)
            {
                var gotLock = false;
                try
                {
                    _lock.Enter(ref gotLock);
                    if (players.Count == 0)
                    {
                        arena = null;
                        _ticker = null;
                    }

                }
                finally
                {
                    if (gotLock) _lock.Exit();
                }
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            SignOff();
            return base.OnDisconnected(stopCalled);
        }

        public void PlayerMoving(PlayerInput input)
        {
            arena.ProcessInput(input, players[Context.ConnectionId]);
        }
    }
}