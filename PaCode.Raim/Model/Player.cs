﻿using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Player
    {
        private const int Speed = 10;
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

        public void Move(MoveDirection direction)
        {
            if ((direction & MoveDirection.Up) == MoveDirection.Up)
                Position.Y += -Speed;
            if ((direction & MoveDirection.Down) == MoveDirection.Down)
                Position.Y += Speed;
            if ((direction & MoveDirection.Right) == MoveDirection.Right)
                Position.X += Speed;
            if ((direction & MoveDirection.Left) == MoveDirection.Left)
                Position.X += -Speed;
        }
    }
}