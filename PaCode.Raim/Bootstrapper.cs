using Nancy;
using Nancy.Conventions;

namespace PaCode.Raim
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);
            nancyConventions.StaticContentsConventions.AddDirectory("Bundles");
            nancyConventions.StaticContentsConventions.AddDirectory("Scripts");
        }
    }
}