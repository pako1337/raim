using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        private static Random rnd = new Random();
        private SpinLock _lock = new SpinLock();
        private CollisionEngine _collisionEngine;
        private Vector2d _arenaSize;
        private const int MaxTimeBetweenFrames = 1000 / 20;

        public Vector2d ArenaSize { get { return _arenaSize; } }
        public List<IGameObject> GameObjects = new List<IGameObject>();
        public List<Obstacle> Obstacles = new List<Obstacle>();

        public Arena()
        {
            _collisionEngine = new CollisionEngine(this);
            _arenaSize = new Vector2d(1000, 700);
            Obstacles.AddRange(new MapGenerator().FromFile());// Generate(ArenaSize));
        }

        public Player RegisterPlayer(string name)
        {
            var player = Player.Create(name, rnd.NextDouble() * ArenaSize.X, rnd.NextDouble() * ArenaSize.Y);
            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                GameObjects.Add(player);
                return player;
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }

        public void UnregisterPlayer(Player player)
        {
            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                GameObjects.RemoveAll(g => g.Id == player.Id);
                GameObjects.RemoveAll(b => b is Bullet && ((Bullet)b).Player.Id == player.Id);
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }

        private DateTime _lastUpdateTime = DateTime.Now;
        public void UpdatePositions(DateTime? updateTimestamp)
        {
            var updateTime = updateTimestamp ?? DateTime.Now;

            var timeBetweenEvents = (updateTime - _lastUpdateTime).TotalMilliseconds;
            if (timeBetweenEvents > MaxTimeBetweenFrames)
                timeBetweenEvents = MaxTimeBetweenFrames;

            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                foreach (var gameObject in GameObjects)
                {
                    gameObject.Position = gameObject.Position.Add(gameObject.Speed.Scale(timeBetweenEvents / 1000));

                    if (gameObject is ILimitedTimelife)
                    {
                        var destroyable = ((ILimitedTimelife)gameObject);
                        destroyable.RecordTimePassed((int)timeBetweenEvents);
                    }

                    _collisionEngine.CalculateCollisions(gameObject);
                }

                _lastUpdateTime = updateTime;
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }

        public IEnumerable<IGameObject> GetGameStateCopy()
        {
            var lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                return GameObjects.ToArray();
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }

        public IEnumerable<IGameObject> RemoveDestroyedObjects()
        {
            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                var objectsToRemove = GameObjects.Where(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed).ToList();
                GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);

                return objectsToRemove;
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }

        public void ProcessInput(PlayerInput input, Player player)
        {
            bool lockTaken = false;
            try
            {
                _lock.Enter(ref lockTaken);
                var createdObjects = player.ProcessInput(input, DateTime.Now);
                GameObjects.AddRange(createdObjects);
            }
            finally
            {
                if (lockTaken)
                    _lock.Exit();
            }
        }
    }
}