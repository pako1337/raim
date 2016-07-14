using System;

namespace PaCode.Raim.Model
{
    public class Bullet : IGameObject, IDestroyable, ILimitedTimelife
    {
        private static int _speed = 350;

        public Guid Id { get; private set; }
        public Vector2d Position { get; set; }
        public Vector2d Speed { get; private set; }
        public Vector2d FacingDirection { get; private set; }
        public bool IsDestroyed { get; set; }
        public int TimeToLive { get; set; }
        public int Size { get; } = 2;
        public Player Player { get; internal set; }
        public string Color { get; private set;}
        public BoundingBox BoundingBox { get { return new BoundingBox(Position.Y + Size, Position.X + Size, Position.Y - Size, Position.X - Size); } }

        private Bullet() { }

        public static Bullet Create(Vector2d position, Vector2d directionUnit, string color)
        {
            return new Bullet()
            {
                Id = Guid.NewGuid(),
                Position = position,
                FacingDirection = directionUnit,
                Speed = directionUnit.Scale(_speed),
                TimeToLive = (int)TimeSpan.FromMilliseconds(1750).TotalMilliseconds,
                Color = color,
            };
        }

        public void RecordTimePassed(int miliseconds)
        {
            TimeToLive -= miliseconds;
            IsDestroyed = IsDestroyed || TimeToLive <= 0;
        }

        public void KilledPlayer()
        {
            Player.KilledEnemy();
        }
    }
}