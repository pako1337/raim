using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Obstacle
    {
        public Vector2d[] Points { get; set; }

        public Obstacle()
        {
            Points = new Vector2d[4]
            {
                new Vector2d(50, 100),
                new Vector2d(100, 75),
                new Vector2d(50, 0),
                new Vector2d(0, 25)
            };
        }
    }
}