using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Obstacle
    {
        public Vector2d[] Points { get; set; }

        public Obstacle(params Vector2d[] points)
        {
            Points = points;
        }
    }
}