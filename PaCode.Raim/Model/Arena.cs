using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        public List<IGameObject> GameObjects = new List<IGameObject>();

        public Player RegisterPlayer(string name)
        {
            var player = Player.Create(name, 250, 250);
            GameObjects.Add(player);
            return player;
        }

        public void UnregisterPlayer(Player player)
        {
            GameObjects.RemoveAll(g => player.Bullets.Any(b => b.Id == g.Id));
            GameObjects.RemoveAll(g => g.Id == player.Id);
        }

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
            CalculateCollisions();
            GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);
        }

        private void CalculateCollisions()
        {
            foreach (var o1 in GameObjects)
                foreach (var o2 in GameObjects)
                {
                    if (o1 == o2) continue;
                    if (ObjectsCollide(o1, o2))
                    {
                        HandleCollision(o1, o2);
                    }
                }
        }

        private bool ObjectsCollide(IGameObject o1, IGameObject o2)
        {
            var distanceVector = new Vector2d(o2.Position.X - o1.Position.X, o2.Position.Y - o1.Position.Y);
            return distanceVector.Length() < o1.Size + o2.Size;
        }

        private void HandleCollision(IGameObject o1, IGameObject o2)
        {
            if (o1 is Player && o2 is Bullet)
                HandleCollision(o1 as Player, o2 as Bullet);
            else if (o1 is Bullet && o2 is Player)
                HandleCollision(o2 as Player, o1 as Bullet);
            else if (o1 is Player && o2 is Player)
                HandleCollision(o1 as Player, o2 as Player);
        }

        private void HandleCollision(Player o1, Bullet o2)
        {
            o1.IsDestroyed = true;
            o2.IsDestroyed = true;
        }

        private void HandleCollision(Player o1, Player o2)
        {
            o1.Position.X -= 30;
            o2.Position.X += 30;
        }
    }
}