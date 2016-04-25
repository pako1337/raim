using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        public List<IGameObject> GameObjects = new List<IGameObject>();

        private DateTime _lastUpdateTime = DateTime.Now;
        public void UpdatePositions(DateTime? updateTimestamp)
        {
            var updateTime = updateTimestamp ?? DateTime.Now;

            var timeBetweenEvents = updateTime - _lastUpdateTime;

            foreach (var gameObject in GameObjects)
            {
                gameObject.Position.X += gameObject.Speed.X * timeBetweenEvents.TotalSeconds;
                gameObject.Position.Y += gameObject.Speed.Y * timeBetweenEvents.TotalSeconds;
                if (gameObject is ILimitedTimelife)
                {
                    var destroyable = ((ILimitedTimelife)gameObject);
                    destroyable.RecordTimePassed((int)timeBetweenEvents.TotalMilliseconds);
                }
            }

            _lastUpdateTime = updateTime;
        }

        public void CalculateCollisions()
        {
            foreach (var o1 in GameObjects)
                foreach (var o2 in GameObjects)
                {
                    if (o1 == o2) continue;
                    if (ObjectsCollide(o1, o2))
                    {
                        if (o1 is IDestroyable)
                            ((IDestroyable)o1).IsDestroyed = true;

                        if (o2 is IDestroyable)
                            ((IDestroyable)o2).IsDestroyed = true;
                    }
                }
        }

        private bool ObjectsCollide(IGameObject o1, IGameObject o2)
        {
            var distanceVector = new Vector2d(o2.Position.X - o1.Position.X, o2.Position.Y - o1.Position.Y);
            return distanceVector.Length() < o1.Size + o2.Size;
        }
    }
}