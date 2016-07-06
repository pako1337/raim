using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Player : IGameObject, IDestroyable
    {
        private const int MaxSpeed = 100;

        public Guid Id { get; set; }
        public string Name { get; private set; }
        public int Size { get; private set; }
        public Vector2d Position { get; set; }
        public Vector2d Speed { get; private set; }
        public Vector2d FacingDirection { get; set; }
        public bool IsDestroyed { get; set; }
        public int Score { get; private set; }
        public string Style { get; private set; }
        public BoundingBox BoundingBox { get { return new BoundingBox(Position.Y + Size, Position.X + Size, Position.Y - Size, Position.X - Size); } }

        private Player() { }

        public static Player Create(string name, double x, double y)
        {
            return new Player
            {
                Id = Guid.NewGuid(),
                Name = name,
                Position = new Vector2d(x, y),
                Speed = new Vector2d(0, 0),
                Size = 20,
                FacingDirection = new Vector2d(1, 0),
                Style = GetRandomColor()
            };
        }

        private static Random rnd = new Random();
        private static List<string> colors = new List<string>
        {
            "orange",
            "green",
            "blue",
            "darkyellow",
            "aqua",
        };

        private static string GetRandomColor()
        {
            return colors[rnd.Next() % colors.Count];
        }

        public IEnumerable<IGameObject> ProcessInput(PlayerInput input, DateTime updateTime)
        {
            ProcessDirection(input.KeysInput);
            FacingDirection = input.FacingDirection;

            var createdObjects = new List<IGameObject>();

            if (input.KeysInput.HasFlag(KeysInput.MouseLeft))
            {
                Shoot(createdObjects, updateTime);
            }

            return createdObjects;
        }

        internal void KilledEnemy()
        {
            Score++;
        }

        private DateTime lastShot = DateTime.Now;
        private void Shoot(List<IGameObject> createdObjects, DateTime shotTime)
        {
            if (shotTime - lastShot < TimeSpan.FromMilliseconds(1000))
                return;

            var facingUnit = FacingDirection.Unit();
            var bulletStartPosition = Position.Add(facingUnit.Scale(Size));
            var bullet = Bullet.Create(bulletStartPosition, facingUnit, Style);
            bullet.Player = this;
            createdObjects.Add(bullet);

            lastShot = shotTime;
        }

        private void ProcessDirection(KeysInput keysInput)
        {
            Speed.X = 0;
            Speed.Y = 0;

            if (keysInput.HasFlag(KeysInput.Up))
                Speed.Y = 1;
            if (keysInput.HasFlag(KeysInput.Down))
                Speed.Y = -1;
            if (keysInput.HasFlag(KeysInput.Right))
                Speed.X = 1;
            if (keysInput.HasFlag(KeysInput.Left))
                Speed.X = -1;

            if (Speed.X != 0 || Speed.Y != 0)
                Speed = Speed.Unit().Scale(MaxSpeed);
        }
    }
}