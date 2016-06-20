using System;
using System.Diagnostics;

namespace PaCode.Raim.Model
{
    [DebuggerDisplay("{X}, {Y}")]
    public class Vector2d
    {
        public double X { get; set; }
        public double Y { get; set; }

        public Vector2d(double x, double y)
        {
            X = x;
            Y = y;
        }

        public Vector2d Add(Vector2d other)
        {
            return new Vector2d(X + other.X, Y + other.Y);
        }

        public double Length()
        {
            return Math.Sqrt(X * X + Y * Y);
        }

        public Vector2d Unit()
        {
            var length = Length();
            return new Vector2d(X / length, Y / length);
        }

        public Vector2d Scale(double scale)
        {
            return new Vector2d(X * scale, Y * scale);
        }

        public Vector2d Subtract(Vector2d prevPoint)
        {
            return Add(prevPoint.Scale(-1));
        }

        public Vector2d Normal()
        {
            return new Vector2d(-Y, X);
        }

        public double DotProduct(Vector2d other)
        {
            return X * other.X + Y * other.Y;
        }
    }
}