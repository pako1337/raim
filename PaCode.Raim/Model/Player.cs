using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Player
    {
        public string Name { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Name = name,
                X = x,
                Y = y
            };
        }
    }
}