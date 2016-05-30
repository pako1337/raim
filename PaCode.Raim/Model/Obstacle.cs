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
                new Vector2d(150, 200),
                new Vector2d(200, 175),
                new Vector2d(150, 100),
                new Vector2d(100, 125)
            };
        }
    }
}