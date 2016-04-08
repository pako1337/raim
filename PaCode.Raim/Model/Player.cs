using System;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Player
    {
        private const int MaxSpeed = 50;

        private DateTime lastUpdate = DateTime.Now;

        public string Name { get; private set; }
        public Vector2d Position { get; private set; }
        public Vector2d Speed { get; private set; }
        public int Size { get; private set; }
        public Vector2d FacingDirection { get; set; }

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Name = name,
                Position = new Vector2d(x, y),
                Speed = new Vector2d(0, 0),
                Size = 20,
                FacingDirection = new Vector2d(1, 0),
            };
        }

        public void Update(DateTime updateTime)
        {
            var changeTime = DateTime.Now;
            var timeBetweenEvents = changeTime - lastUpdate;

            Position.X += Speed.X * timeBetweenEvents.TotalSeconds;
            Position.Y += Speed.Y * timeBetweenEvents.TotalSeconds;

            lastUpdate = changeTime;
        }

        public void ProcessInput(PlayerInput input)
        {
            ProcessDirection(input.MoveDirection);
            FacingDirection = input.FacingDirection;
        }

        private void ProcessDirection(MoveDirection moveDirection)
        {
            Speed.X = 0;
            Speed.Y = 0;

            if (moveDirection.HasFlag(MoveDirection.Up))
                Speed.Y = MaxSpeed;
            if (moveDirection.HasFlag(MoveDirection.Down))
                Speed.Y = -MaxSpeed;
            if (moveDirection.HasFlag(MoveDirection.Right))
                Speed.X = MaxSpeed;
            if (moveDirection.HasFlag(MoveDirection.Left))
                Speed.X = -MaxSpeed;
        }
    }
}