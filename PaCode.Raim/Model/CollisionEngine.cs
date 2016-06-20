using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class CollisionEngine
    {
        private readonly Arena _arena;

        public CollisionEngine(Arena arena)
        {
            _arena = arena;
        }

        public void CalculateCollisions(IGameObject o1)
        {
            foreach (var obstacle in _arena.Obstacles)
            {
                var collisionResult = ObstacleCollide(obstacle, o1);
                if (collisionResult != null)
                {
                    // Item1 - axis unit vector, Item2 collision size
                    HandleCollision(o1, obstacle, collisionResult);
                }
            }

            foreach (var o2 in _arena.GameObjects)
            {
                if (o1 == o2) continue;
                var collisionResult = ObjectsCollide(o1, o2);
                if (collisionResult != null)
                {
                    HandleCollision(o1, o2, collisionResult);
                }
            }
        }

        private Tuple<Vector2d, double> ObjectsCollide(IGameObject o1, IGameObject o2)
        {
            var distanceVector = new Vector2d(o2.Position.X - o1.Position.X, o2.Position.Y - o1.Position.Y);
            var collisionDistance = (o1.Size + o2.Size) - distanceVector.Length();

            if (collisionDistance > 0)
                return Tuple.Create(distanceVector.Unit(), -collisionDistance);
            else
                return null;
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

                if (intersectionRange.Length < smallestDisplacement.Item2.Length - 0.0001 || // new collision is smaller
                    (Math.Abs(intersectionRange.Length - smallestDisplacement.Item2.Length) < 0.0001 && // or collision sizes are the same
                     Math.Abs(intersectionRange.Start) < Math.Abs(smallestDisplacement.Item2.Start)))    // but collision is closer to polygon side
                {
                    smallestDisplacement = Tuple.Create(axisVector.Item1, intersectionRange);
                }
            }

            return Tuple.Create(smallestDisplacement.Item1, smallestDisplacement.Item2.Length);
        }

        private void HandleCollision(object o1, object o2, Tuple<Vector2d, double> collision)
        {
            if (o1 is Player && o2 is Bullet)
                HandleCollision(o1 as Player, o2 as Bullet);
            else if (o1 is Bullet && o2 is Player)
                HandleCollision(o2 as Player, o1 as Bullet);
            else if (o1 is Player && o2 is Player)
                HandleCollision(o1 as Player, collision);
            else if (o1 is Player && o2 is Obstacle)
                HandleCollision(o1 as Player, collision);
            else if (o1 is Bullet && o2 is Obstacle)
                HandleCollision(o1 as Bullet, o2 as Obstacle);
        }

        private void HandleCollision(Player o1, Bullet o2)
        {
            if (o2.Player == o1)
                return;

            o1.IsDestroyed = true;
            o2.IsDestroyed = true;
            o2.KilledPlayer();
        }

        private void HandleCollision(Bullet o1, Obstacle o2)
        {
            o1.IsDestroyed = true;
        }

        private void HandleCollision(Player o1, Tuple<Vector2d, double> collision)
        {
            var collisionFixVector = collision.Item1.Scale(collision.Item2);

            o1.Position = o1.Position.Add(collisionFixVector);
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