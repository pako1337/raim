using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Player : IGameObject
    {
        private const int MaxSpeed = 50;

        private DateTime lastUpdate = DateTime.Now;


        public Guid Id { get; set; }
        public string Name { get; private set; }
        public int Size { get; private set; }
        public Vector2d Position { get; private set; }
        public Vector2d Speed { get; private set; }
        public Vector2d FacingDirection { get; set; }

        public List<Bullet> Bullets { get; } = new List<Bullet>();

        private Player() { }

        public static Player Create(string name, int x, int y)
        {
            return new Player
            {
                Id = Guid.NewGuid(),
                Name = name,
                Position = new Vector2d(x, y),
                Speed = new Vector2d(0, 0),
                Size = 20,
                FacingDirection = new Vector2d(1, 0),
            };
        }

        public void Update(DateTime updateTime)
        {
            var changeTime = updateTime;
            var timeBetweenEvents = changeTime - lastUpdate;

            Position.X += Speed.X * timeBetweenEvents.TotalSeconds;
            Position.Y += Speed.Y * timeBetweenEvents.TotalSeconds;

            lastUpdate = changeTime;
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

        private DateTime _lastShot = DateTime.Now;
        private void Shoot(List<IGameObject> createdObjects, DateTime shotTime)
        {
            if (shotTime - _lastShot < TimeSpan.FromMilliseconds(500))
                return;

            var bullet = Bullet.Create(Position.X, Position.Y, FacingDirection);
            Bullets.Add(bullet);
            createdObjects.Add(bullet);

            _lastShot = shotTime;
        }

        private void ProcessDirection(KeysInput keysInput)
        {
            Speed.X = 0;
            Speed.Y = 0;

            if (keysInput.HasFlag(KeysInput.Up))
                Speed.Y = MaxSpeed;
            if (keysInput.HasFlag(KeysInput.Down))
                Speed.Y = -MaxSpeed;
            if (keysInput.HasFlag(KeysInput.Right))
                Speed.X = MaxSpeed;
            if (keysInput.HasFlag(KeysInput.Left))
                Speed.X = -MaxSpeed;
        }
    }
}