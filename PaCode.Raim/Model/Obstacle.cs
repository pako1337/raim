using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Obstacle
    {
        public Vector2d[] Points { get; set; }
        public BoundingBox BoundingBox { get; private set; }

        public Obstacle(params Vector2d[] points)
        {
            Points = points;

            var top = Points.Max(p => p.Y);
            var bottom = Points.Min(p => p.Y);
            var right = Points.Max(p => p.X);
            var left = Points.Min(p => p.X);

            BoundingBox = new BoundingBox(top, right, bottom, left);
        }
    }
}