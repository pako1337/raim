using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class ArenaTicker : IDisposable
    {
        private const int _updateInterval = 1000 / 30;

        private readonly IHubConnectionContext<dynamic> _clients;
        private Timer _timer;
        private Arena _arena;

        public static ArenaTicker Create(Arena arena)
        {
            return new ArenaTicker(GlobalHost.ConnectionManager.GetHubContext<RaimHub>().Clients, arena);
        }

        private ArenaTicker(IHubConnectionContext<dynamic> clients, Arena arena)
        {
            _clients = clients;
            _arena = arena;

            _timer = new Timer(UpdateArena, null, _updateInterval, _updateInterval);
        }

        private void UpdateArena(object state)
        {
            if (_arena == null)
            {
                _timer.Dispose();
                _timer = null;
                return;
            }

            _arena.UpdatePositions(DateTime.Now);
            var removedPlayers = _arena.RemoveDestroyedObjects().OfType<Player>();
            _clients.Group(_arena.Id).PlayerMoved(_arena.GetGameStateCopy());

            foreach (var player in removedPlayers)
            {
                _clients.Group(_arena.Id).SignedOff(player);
            }
        }

        public void Dispose()
        {
            _timer.Dispose();
            _timer = null;
            GC.SuppressFinalize(this);
        }
    }
}