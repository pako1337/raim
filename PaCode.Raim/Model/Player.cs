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

        public void Update(DateTime updateTime)
        {
            var changeTime = DateTime.Now;
            var timeBetweenEvents = changeTime - lastUpdate;

            Position.X += (int)(Speed.X * timeBetweenEvents.TotalSeconds);
            Position.Y += (int)(Speed.Y * timeBetweenEvents.TotalSeconds);

            lastUpdate = changeTime;
        }

        public void ChangeSpeed(MoveDirection direction)
        {
            Speed.X = 0;
            Speed.Y = 0;
            if (direction.HasFlag(MoveDirection.Up))
                Speed.Y = -MaxSpeed;
            if (direction.HasFlag(MoveDirection.Down))
                Speed.Y = MaxSpeed;
            if (direction.HasFlag(MoveDirection.Right))
                Speed.X = MaxSpeed;
            if (direction.HasFlag(MoveDirection.Left))
                Speed.X = -MaxSpeed;
        }
    }
}