using System.Collections.Generic;
using Microsoft.AspNet.SignalR;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        private static Dictionary<string, string> players = new Dictionary<string, string>();

        public void Register(string name)
        {
            players.Add(Context.ConnectionId, name);
            Clients.All.Registered(name);
        }
    }
}