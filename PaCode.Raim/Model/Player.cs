using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class Player
    {
        public string Name { get; set; }
        public Vector2d Position { get; set; }
        public int Size { get; set; }

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Name = name,
                Position = new Vector2d(x, y),
                Size = 20,
            };
        }
    }
}