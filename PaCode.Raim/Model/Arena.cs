﻿using System;
using System.Collections.Generic;
using System.Linq;
using PaCode.Raim.Home;

namespace PaCode.Raim.Model
{
    public class Arena
    {
        private static Random rnd = new Random();
        private static object _lock = new object();
        public Vector2d ArenaSize { get { return new Vector2d(1000, 500); } }
        public List<IGameObject> GameObjects = new List<IGameObject>();
        public List<Obstacle> Obstacles = new List<Obstacle>() { new Obstacle() };

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

                    CheckArenaBoundsCollision(gameObject);

                    if (gameObject is ILimitedTimelife)
                    {
                        var destroyable = ((ILimitedTimelife)gameObject);
                        destroyable.RecordTimePassed((int)timeBetweenEvents.TotalMilliseconds);
                    }

                    CalculateCollisions(gameObject);
                }

                _lastUpdateTime = updateTime;
                GameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);

                return GameObjects.ToArray();
            }
        }

        private void CheckArenaBoundsCollision(IGameObject gameObject)
        {
            if (gameObject.Position.X < 0 + gameObject.Size)
                gameObject.Position.X = 0 + gameObject.Size;
            else if (gameObject.Position.X > ArenaSize.X - gameObject.Size)
                gameObject.Position.X = ArenaSize.X - gameObject.Size;

            if (gameObject.Position.Y < 0 + gameObject.Size)
                gameObject.Position.Y = 0 + gameObject.Size;
            else if (gameObject.Position.Y > ArenaSize.Y - gameObject.Size)
                gameObject.Position.Y = ArenaSize.Y - gameObject.Size;
        }

        public void ProcessInput(PlayerInput input, Player player)
        {
            lock (_lock)
            {
                var createdObjects = player.ProcessInput(input, DateTime.Now);
                GameObjects.AddRange(createdObjects);
            }
        }

        private void CalculateCollisions(IGameObject o1)
        {
            foreach (var obstacle in Obstacles)
            {
                var collisionDisplacement = ObstacleCollide(obstacle, o1);
                if (collisionDisplacement != null)
                {
                    // Item1 - axis unit vector, Item2 collision size
                    var collisionFix = collisionDisplacement.Item1.Scale(collisionDisplacement.Item2);
                    o1.Position = o1.Position.Add(collisionFix);
                }
            }

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
            o2.KilledPlayer();
        }

        private void HandleCollision(Player o1, Player o2)
        {
            var distanceVector = new Vector2d(o2.Position.X - o1.Position.X, o2.Position.Y - o1.Position.Y);
            var distance = distanceVector.Length();
            var collisionLength = distance - (o1.Size + o2.Size);

            var collisionFixVector = distanceVector.Unit().Scale(collisionLength);

            o1.Position = o1.Position.Add(collisionFixVector);
        }


        private Tuple<Vector2d, double> ObstacleCollide(Obstacle obstacle, IGameObject gameObject)
        {
            var smallestDisplacement = Tuple.Create(new Vector2d(0, 0), new Range(double.MinValue, double.MaxValue));

            foreach (var axisVector in GetAxisVectors(obstacle, gameObject))
            {
                var obstacleProjection = ProjectOntoAxis(axisVector.Item1, obstacle);
                var objectProjection = ProjectOntoAxis(axisVector.Item1, gameObject);

                var intersectionRange = obstacleProjection.Intersect(objectProjection);
                intersectionRange = intersectionRange.Add(axisVector.Item2);

                if (intersectionRange.Length < 0.0001)
                    return null;

                if (intersectionRange.Length < smallestDisplacement.Item2.Length ||
                    (Math.Abs(intersectionRange.Length - smallestDisplacement.Item2.Length) < 0.0001 && Math.Abs(intersectionRange.Start) < Math.Abs(smallestDisplacement.Item2.Start)))
                    smallestDisplacement = Tuple.Create(axisVector.Item1, intersectionRange);
            }

            return Tuple.Create(smallestDisplacement.Item1, smallestDisplacement.Item2.Length);
        }

        private IEnumerable<Tuple<Vector2d, double>> GetAxisVectors(Obstacle obstacle, IGameObject gameObject)
        {
            var prevPoint = obstacle.Points[0];

            for (int i = 1; i <= obstacle.Points.Length; i++)
            {
                var currentPoint = obstacle.Points[i % obstacle.Points.Length];
                var sideVector = currentPoint.Subtract(prevPoint);
                var axisVector = sideVector.Unit().Normal();
                var displacementFromOrigin = axisVector.DotProduct(prevPoint);
                yield return Tuple.Create(axisVector, -displacementFromOrigin);
                prevPoint = currentPoint;
            }

            for (int i = 0; i < obstacle.Points.Length; i++)
            {
                var circleToPointVector = gameObject.Position.Subtract(obstacle.Points[i]).Unit();
                var displacementFromOrigin = circleToPointVector.DotProduct(obstacle.Points[i]);
                yield return Tuple.Create(circleToPointVector, -displacementFromOrigin);
            }
        }

        private Range ProjectOntoAxis(Vector2d axisVector, Obstacle obstacle)
        {
            double min = double.MaxValue;
            double max = double.MinValue;

            for (int i = 0; i < obstacle.Points.Length; i++)
            {
                var currentPoint = obstacle.Points[i];

                var projectionSize = axisVector.DotProduct(currentPoint);
                if (projectionSize < min)
                    min = projectionSize;
                if (projectionSize > max)
                    max = projectionSize;
            }

            return new Range(min, max);
        }

        private Range ProjectOntoAxis(Vector2d axisVector, IGameObject gameObject)
        {
            var centerProjection = axisVector.DotProduct(gameObject.Position);
            return new Range(centerProjection - gameObject.Size, centerProjection + gameObject.Size);
        }
    }
}