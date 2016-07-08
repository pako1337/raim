using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;

namespace PaCode.Raim
{
    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = parameters => View["Index.html"];
            Get["/mapBuilder"] = parameters => View["MapBuilder.html"];
        }
    }
}
