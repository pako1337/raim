using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class ArenaTicker
    {
        private static ArenaTicker _instance = new ArenaTicker(GlobalHost.ConnectionManager.GetHubContext<RaimHub>().Clients);
        private const int _updateInterval = 1000 / 30;

        private readonly IHubConnectionContext<dynamic> _clients;
        private static SpinLock _lock = new SpinLock();
        private Timer _timer;

        public static ArenaTicker Instance
        {
            get
            {
                if (_instance == null)
                {
                    bool gotLock = false;
                    try
                    {
                        _lock.Enter(ref gotLock);
                        if (_instance == null)
                            _instance = new ArenaTicker(GlobalHost.ConnectionManager.GetHubContext<RaimHub>().Clients);
                    }
                    finally
                    {
                        if (gotLock) _lock.Exit();
                    }
                }

                return _instance;
            }
        }

        private ArenaTicker(IHubConnectionContext<dynamic> clients)
        {
            _clients = clients;
            _timer = new Timer(UpdateArena, null, _updateInterval, _updateInterval);
        }

        private void UpdateArena(object state)
        {
            if (RaimHub.arena == null)
            {
                _instance = null;
                _timer.Dispose();
                _timer = null;
                return;
            }

            var go = RaimHub.arena.UpdatePositions(DateTime.Now);
            _clients.All.PlayerMoved(go);

            var removedPlayers = RaimHub.arena.RemoveDestroyedObjects().OfType<Player>();
            foreach (var player in removedPlayers)
            {
                _clients.All.SignedOff(player.Name);
            }
        }
    }
}