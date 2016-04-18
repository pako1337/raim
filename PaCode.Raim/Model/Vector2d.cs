using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Vector2d
    {
        public double X { get; set; }
        public double Y { get; set; }

        public Vector2d(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double Length()
        {
            return Math.Sqrt(X * X + Y * Y);
        }

        public Vector2d Unit()
        {
            var length = Length();
            return new Vector2d(X / length, Y = Y / length);
        }

        public Vector2d Scale(double scale)
        {
            return new Vector2d(X * scale, Y * scale);
        }
    }
}