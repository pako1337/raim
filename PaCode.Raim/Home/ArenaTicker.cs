using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace PaCode.Raim.Home
{
    public class ArenaTicker
    {
        private readonly static ArenaTicker _instance = new ArenaTicker(GlobalHost.ConnectionManager.GetHubContext<RaimHub>().Clients);
        private const int _updateInterval = 1000 / 30;

        private readonly IHubConnectionContext<dynamic> _clients;
        private readonly Timer _timer;

        public static ArenaTicker Instance {  get { return _instance; } }

        private ArenaTicker(IHubConnectionContext<dynamic> clients)
        {
            _clients = clients;
            _timer = new Timer(UpdateArena, null, _updateInterval, _updateInterval);
        }

        private void UpdateArena(object state)
        {
            var go = RaimHub.arena.UpdatePositions(DateTime.Now);
            _clients.All.PlayerMoved(go);
        }
    }
}