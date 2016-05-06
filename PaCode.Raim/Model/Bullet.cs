using System;

namespace PaCode.Raim.Model
{
    public class Bullet : IGameObject, IDestroyable, ILimitedTimelife
    {
        private static int _speed = 60;

        public Guid Id { get; private set; }
        public Vector2d Position { get; private set; }
        public Vector2d Speed { get; private set; }
        public Vector2d FacingDirection { get; private set; }
        public bool IsDestroyed { get; set; }
        public int TimeToLive { get; set; }
        public int Size { get; } = 2;

        private Bullet() { }

        public static Bullet Create(Vector2d position, Vector2d direction)
        {
            return new Bullet()
            {
                Id = Guid.NewGuid(),
                Position = position,
                FacingDirection = direction,
                Speed = direction.Unit().Scale(_speed),
                TimeToLive = (int)TimeSpan.FromSeconds(5).TotalMilliseconds,
            };
        }

        public void RecordTimePassed(int miliseconds)
        {
            TimeToLive -= miliseconds;
            IsDestroyed = IsDestroyed || TimeToLive <= 0;
        }
    }
}