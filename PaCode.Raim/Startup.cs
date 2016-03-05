using Owin;

namespace PaCode.Raim
{
    public class Startup
    {
        public void Configuration(IAppBuilder builder)
        {
            builder.MapSignalR();
        }
    }
}
