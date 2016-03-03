using Microsoft.AspNet.SignalR;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        public void Register(string name)
        {
            Clients.Caller.Registered(name);
        }
    }
}