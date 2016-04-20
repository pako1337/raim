using System;

namespace PaCode.Raim.Model
{
    public class Bullet : IGameObject, IDestroyable
    {
        private DateTime lastUpdate = DateTime.Now;
        private DateTime creationTime;

        public Guid Id { get; private set; }
        public Vector2d Position { get; private set; }
        public Vector2d Speed { get; private set; }
        public Vector2d FacingDirection { get; private set; }
        public bool IsDestroyed { get; private set; }

        private Bullet() { }

        public static Bullet Create(double x, double y, Vector2d direction)
        {
            return new Bullet()
            {
                Id = Guid.NewGuid(),
                Position = new Vector2d(x, y),
                FacingDirection = direction,
                Speed = direction.Unit().Scale(10),
                creationTime = DateTime.Now,
            };
        }

        public void Update(DateTime updateTime)
        {
            if (updateTime - creationTime > TimeSpan.FromSeconds(5))
            {
                IsDestroyed = true;
                return;
            }

            var changeTime = updateTime;
            var timeBetweenEvents = changeTime - lastUpdate;

            Position.X += Speed.X * timeBetweenEvents.TotalSeconds;
            Position.Y += Speed.Y * timeBetweenEvents.TotalSeconds;

            lastUpdate = changeTime;
        }
    }
}