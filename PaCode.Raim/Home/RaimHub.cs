using Microsoft.AspNet.SignalR;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        public void Register(string name)
        {
            Clients.All.Registered(name);
        }
    }
}