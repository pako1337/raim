using System;
using System.Collections.Generic;
using System.Linq;
using Owin;

namespace PaCode.Raim
{
    public class Startup
    {
        public void Configuration(IAppBuilder builder)
        {
            builder.UseNancy();
        }
    }
}
