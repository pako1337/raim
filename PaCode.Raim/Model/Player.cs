using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Player
    {
        private const int MaxSpeed = 10;
        public string Name { get; private set; }
        public Vector2d Position { get; private set; }
        public Vector2d Speed { get; private set; }
        public int Size { get; private set; }

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Name = name,
                Position = new Vector2d(x, y),
                Speed = new Vector2d(0, 0),
                Size = 20,
            };
        }

        public void Move(MoveDirection direction)
        {
            if ((direction & MoveDirection.Up) == MoveDirection.Up)
                Position.Y += -MaxSpeed;
            if ((direction & MoveDirection.Down) == MoveDirection.Down)
                Position.Y += MaxSpeed;
            if ((direction & MoveDirection.Right) == MoveDirection.Right)
                Position.X += MaxSpeed;
            if ((direction & MoveDirection.Left) == MoveDirection.Left)
                Position.X += -MaxSpeed;
        }
    }
}