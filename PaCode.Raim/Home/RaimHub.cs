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
        public static List<Tuple<Arena, ArenaTicker>> arenas = new List<Tuple<Arena, ArenaTicker>>(10);
        private static SpinLock _lock = new SpinLock();

        public void Register(string name)
        {
            name = HttpUtility.HtmlEncode(name);

            var arena = GetArena();

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

            GetArena().UnregisterPlayer(player);
            Clients.All.SignedOff(player);

            if (players.Count == 0)
            {
                var gotLock = false;
                try
                {
                    _lock.Enter(ref gotLock);
                    if (players.Count == 0)
                    {
                        var arenaTuple = arenas[0];
                        arenaTuple.Item2.Dispose();
                        arenas.RemoveAt(0);
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
            GetArena().ProcessInput(input, players[Context.ConnectionId]);
        }

        private Arena GetArena()
        {
            if (arenas.Count == 0)
            {
                var gotLock = false;
                try
                {
                    if (arenas.Count == 0)
                    {
                        var arena = new Arena();
                        arenas.Add(Tuple.Create(arena, ArenaTicker.Create(arena)));
                    }
                }
                finally
                {
                    if (gotLock) _lock.Exit();
                }
            }

            return arenas[0].Item1;
        }
    }
}