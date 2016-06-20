using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        private static Random rnd = new Random();
        private static object _lock = new object();
        private CollisionEngine _collisionEngine;

        public Vector2d ArenaSize { get { return new Vector2d(1500, 1300); } }
        public List<IGameObject> GameObjects = new List<IGameObject>();
        public List<Obstacle> Obstacles;

        public Arena()
        {
            _collisionEngine = new CollisionEngine(this);

            int borderMargin = 200;
            Obstacles = new List<Obstacle>() {
                new Obstacle( // top
                    new Vector2d(0, ArenaSize.Y),
                    new Vector2d(0, ArenaSize.Y + borderMargin),
                    new Vector2d(ArenaSize.X, ArenaSize.Y + borderMargin),
                    new Vector2d(ArenaSize.X, ArenaSize.Y)),
                new Obstacle( // right
                    new Vector2d(ArenaSize.X, 0),
                    new Vector2d(ArenaSize.X, ArenaSize.Y),
                    new Vector2d(ArenaSize.X + borderMargin, ArenaSize.Y),
                    new Vector2d(ArenaSize.X + borderMargin, 0)),
                new Obstacle( // bottom
                    new Vector2d(0, -borderMargin),
                    new Vector2d(0, 0),
                    new Vector2d(ArenaSize.X, 0),
                    new Vector2d(ArenaSize.X, -borderMargin)),
                new Obstacle( // left
                    new Vector2d(0, 0),
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(-borderMargin, ArenaSize.Y),
                    new Vector2d(0, ArenaSize.Y)),
                new Obstacle(
                    new Vector2d(150, 200),
                    new Vector2d(200, 175),
                    new Vector2d(150, 100),
                    new Vector2d(100, 125)),
            };
        }

        public Player RegisterPlayer(string name)
        {
            var player = Player.Create(name, rnd.NextDouble() * ArenaSize.X, rnd.NextDouble() * ArenaSize.Y);
            lock (_lock)
                GameObjects.Add(player);
            return player;
        }

        public void UnregisterPlayer(Player player)
        {
            lock (_lock)
            {
                GameObjects.RemoveAll(g => g.Id == player.Id);
                GameObjects.RemoveAll(b => b is Bullet && ((Bullet)b).Player.Id == player.Id);
            }
        }

        private DateTime _lastUpdateTime = DateTime.Now;
        public IEnumerable<IGameObject> UpdatePositions(DateTime? updateTimestamp)
        {
            var updateTime = updateTimestamp ?? DateTime.Now;

            var timeBetweenEvents = updateTime - _lastUpdateTime;

            lock (_lock)
            {
                foreach (var gameObject in GameObjects)
                {
                    gameObject.Position = gameObject.Position.Add(gameObject.Speed.Scale(timeBetweenEvents.TotalSeconds));

                    if (gameObject is ILimitedTimelife)
                    {
                        var destroyable = ((ILimitedTimelife)gameObject);
                        destroyable.RecordTimePassed((int)timeBetweenEvents.TotalMilliseconds);
                    }

                    _collisionEngine.CalculateCollisions(gameObject);
                }

                _lastUpdateTime = updateTime;
                GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);

                return GameObjects.ToArray();
            }
        }

        public void ProcessInput(PlayerInput input, Player player)
        {
            lock (_lock)
            {
                var createdObjects = player.ProcessInput(input, DateTime.Now);
                GameObjects.AddRange(createdObjects);
            }
        }
    }
}