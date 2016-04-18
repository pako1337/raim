using System;

namespace PaCode.Raim.Model
{
    public class Bullet : IGameObject
    {
        private DateTime lastUpdate = DateTime.Now;

        public Guid Id { get; private set; }
        public Vector2d Position { get; set; }
        public Vector2d Speed { get; set; }
        public Vector2d FacingDirection { get; set; }

        private Bullet() { }

        public static Bullet Create(double x, double y, Vector2d direction)
        {
            return new Bullet()
            {
                Id = Guid.NewGuid(),
                Position = new Vector2d(x, y),
                Speed = direction.Unit().Scale(10),
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
    }
}