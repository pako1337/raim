using System.Globalization;
using System.Threading;
using Owin;

namespace PaCode.Raim
{
    public class Startup
    {
        public void Configuration(IAppBuilder builder)
        {
            builder.SanitizeThreadCulture();
            builder.MapSignalR();
        }
    }

    internal static class AppBuilderExtensions
    {
        public static void SanitizeThreadCulture(this IAppBuilder app)
        {
            var currentCulture = CultureInfo.CurrentCulture;

            // at the top of any culture should be the invariant culture,
            // find it doing an .Equals comparison ensure that we will
            // find it and not loop endlessly
            var invariantCulture = currentCulture;
            while (invariantCulture.Equals(CultureInfo.InvariantCulture) == false)
                invariantCulture = invariantCulture.Parent;

            if (ReferenceEquals(invariantCulture, CultureInfo.InvariantCulture))
                return;

            var thread = Thread.CurrentThread;
            thread.CurrentCulture = CultureInfo.GetCultureInfo(thread.CurrentCulture.Name);
            thread.CurrentUICulture = CultureInfo.GetCultureInfo(thread.CurrentUICulture.Name);
        }
    }
}
