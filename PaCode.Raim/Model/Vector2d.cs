using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Vector2d
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Vector2d(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}