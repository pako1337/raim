using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class Player
    {
        public string Name { get; set; }
        public Vector2d Position { get; set; }

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Name = name,
                Position = new Vector2d(x, y)
            };
        }
    }

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