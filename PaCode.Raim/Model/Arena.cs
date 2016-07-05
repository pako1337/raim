using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        private static Random rnd = new Random();
        private static object _lock = new object();
        private CollisionEngine _collisionEngine;
        private Vector2d _arenaSize;
        private const int MaxTimeBetweenFrames = 1000 / 20;

        public Vector2d ArenaSize { get { return _arenaSize; } }
        public List<IGameObject> GameObjects = new List<IGameObject>();
        public List<Obstacle> Obstacles = new List<Obstacle>();
        Regex _commentRegex = new Regex("--.*", RegexOptions.Compiled | RegexOptions.Singleline);

        public Arena()
        {
            _collisionEngine = new CollisionEngine(this);

            using (var reader = new StreamReader(Path.Combine(Directory.GetCurrentDirectory(), "ArenaDefinitions/Arena51.txt")))
            {
                var size = reader.ReadLine()
                                 .Split(new[] { ',' },  StringSplitOptions.RemoveEmptyEntries)
                                 .Select(s => double.Parse(s))
                                 .ToArray();
                _arenaSize = new Vector2d(size[0], size[1]);

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    line = _commentRegex.Replace(line, "");
                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    var obstaclePoints = line.Split(',')
                                             .Select(s => s.Trim())
                                             .Select((s, i) => new { s, index = i / 2 })
                                             .GroupBy(s => s.index)
                                             .Select(s => new[] { double.Parse(s.First().s), double.Parse(s.Skip(1).First().s) })
                                             .Select(s => new Vector2d(s[0], s[1]))
                                             .ToArray();
                    Obstacles.Add(new Obstacle(obstaclePoints));
                }
            }

            int borderMargin = 700;
            Obstacles.AddRange(new List<Obstacle>() {
                new Obstacle( // top
                    new Vector2d(-borderMargin, ArenaSize.Y),
                    new Vector2d(-borderMargin, ArenaSize.Y + borderMargin),
                    new Vector2d(ArenaSize.X + borderMargin, ArenaSize.Y + borderMargin),
                    new Vector2d(ArenaSize.X + borderMargin, ArenaSize.Y)),
                new Obstacle( // right
                    new Vector2d(ArenaSize.X, 0),
                    new Vector2d(ArenaSize.X, ArenaSize.Y),
                    new Vector2d(ArenaSize.X + borderMargin, ArenaSize.Y),
                    new Vector2d(ArenaSize.X + borderMargin, 0)),
                new Obstacle( // bottom
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(ArenaSize.X + borderMargin, 0),
                    new Vector2d(ArenaSize.X + borderMargin, -borderMargin),
                    new Vector2d(-borderMargin, -borderMargin)),
                new Obstacle( // left
                    new Vector2d(0, 0),
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(-borderMargin, ArenaSize.Y),
                    new Vector2d(0, ArenaSize.Y))
            });
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

            var timeBetweenEvents = (updateTime - _lastUpdateTime).TotalMilliseconds;
            if (timeBetweenEvents > MaxTimeBetweenFrames)
                timeBetweenEvents = MaxTimeBetweenFrames;

            lock (_lock)
            {
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

                return GameObjects.ToArray();
            }
        }

        public IEnumerable<IGameObject> RemoveDestroyedObjects()
        {
            var objectsToRemove = GameObjects.Where(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);
            GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);

            return objectsToRemove;
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