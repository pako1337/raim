using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class Obstacle : IGameObject
    {
        public Guid Id { get; set; }
        public Vector2d Position { get; set; }
        public Vector2d Speed { get; set; }
        public Vector2d FacingDirection { get; set; }
        public int Size { get; set; }
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