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
            Arena arena;
            Player player;

            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);

                arena = arenas.FirstOrDefault(a => a.Item1.Players.Count < 2)?.Item1;
                if (arena == null)
                {
                    arena = new Arena();
                    arenas.Add(Tuple.Create(arena, ArenaTicker.Create(arena)));
                }

                Groups.Add(Context.ConnectionId, arena.Id);
                player = arena.RegisterPlayer(name);
            }
            finally
            {
                if (lockTaken) _lock.Exit();
            }

            players.Add(Context.ConnectionId, player);
            Clients.Caller.SignedIn(player.Id);
            Clients.Caller.SetupArena(arena);
            Clients.Group(arena.Id).Registered(player);
            Clients.Caller.OtherPlayers(arena.Players.Where(p => p.Name != name));
        }

        public void SignOff()
        {
            var gotLock = false;
            Player player;

            try
            {
                _lock.Enter(ref gotLock);

                if (!players.ContainsKey(Context.ConnectionId))
                    return;

                player = players[Context.ConnectionId];

                var arena = GetArena();
                if (arena == null)
                    return;

                arena.UnregisterPlayer(player);

                if (arena.Players.Count == 0)
                {
                    var arenaTuple = arenas.First(a => a.Item1 == arena);
                    arenaTuple.Item2.Dispose();
                    arenas.Remove(arenaTuple);
                }

                players.Remove(Context.ConnectionId);
                Groups.Remove(Context.ConnectionId, arena.Id);
                Clients.Group(arena.Id).SignedOff(player);
            }
            finally
            {
                if (gotLock) _lock.Exit();
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
            var player = players[Context.ConnectionId];
            var arenaTuple = arenas.FirstOrDefault(a => a.Item1.Players.Contains(player));
            return arenaTuple?.Item1;
        }
    }
}