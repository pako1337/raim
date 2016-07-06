using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace PaCode.Raim.Model
{
    public class MapGenerator
    {
        private readonly Random rnd = new Random();
        private Regex _commentRegex = new Regex("--.*", RegexOptions.Compiled | RegexOptions.Singleline);

        public IEnumerable<Obstacle> FromFile()
        {
            var obstacles = new List<Obstacle>(10);
            Vector2d arenaSize = null;

            using (var reader = new StreamReader(Path.Combine(Directory.GetCurrentDirectory(), "ArenaDefinitions/Arena51.txt")))
            {
                var size = reader.ReadLine()
                                 .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                 .Select(s => double.Parse(s))
                                 .ToArray();
                arenaSize = new Vector2d(size[0], size[1]);

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
                    obstacles.Add(new Obstacle(obstaclePoints));
                }
            }

            int borderMargin = 700;
            obstacles.AddRange(new List<Obstacle>() {
                new Obstacle( // top
                    new Vector2d(-borderMargin, arenaSize.Y),
                    new Vector2d(-borderMargin, arenaSize.Y + borderMargin),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y + borderMargin),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y)),
                new Obstacle( // right
                    new Vector2d(arenaSize.X, 0),
                    new Vector2d(arenaSize.X, arenaSize.Y),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y),
                    new Vector2d(arenaSize.X + borderMargin, 0)),
                new Obstacle( // bottom
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(arenaSize.X + borderMargin, 0),
                    new Vector2d(arenaSize.X + borderMargin, -borderMargin),
                    new Vector2d(-borderMargin, -borderMargin)),
                new Obstacle( // left
                    new Vector2d(0, 0),
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(-borderMargin, arenaSize.Y),
                    new Vector2d(0, arenaSize.Y))
            });

            return obstacles;
        }

        public IEnumerable<Obstacle> Generate(Vector2d arenaSize)
        {
            var obstacles = new List<Obstacle>(8);
            int borderMargin = 700;
            obstacles.AddRange(new List<Obstacle>() {
                new Obstacle( // top
                    new Vector2d(-borderMargin, arenaSize.Y),
                    new Vector2d(-borderMargin, arenaSize.Y + borderMargin),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y + borderMargin),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y)),
                new Obstacle( // right
                    new Vector2d(arenaSize.X, 0),
                    new Vector2d(arenaSize.X, arenaSize.Y),
                    new Vector2d(arenaSize.X + borderMargin, arenaSize.Y),
                    new Vector2d(arenaSize.X + borderMargin, 0)),
                new Obstacle( // bottom
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(arenaSize.X + borderMargin, 0),
                    new Vector2d(arenaSize.X + borderMargin, -borderMargin),
                    new Vector2d(-borderMargin, -borderMargin)),
                new Obstacle( // left
                    new Vector2d(0, 0),
                    new Vector2d(-borderMargin, 0),
                    new Vector2d(-borderMargin, arenaSize.Y),
                    new Vector2d(0, arenaSize.Y))
            });

            obstacles.AddRange(GenerateObstacle(arenaSize));

            return obstacles;
        }

        private IEnumerable<Obstacle> GenerateObstacle(Vector2d arenaSize)
        {
            var size = new Vector2d(rnd.Next(290, 290 * 2), rnd.Next(290, 290 * 2));
            var position = new Vector2d(rnd.Next(50, (int)(arenaSize.X - size.X - 50)), rnd.Next(50, (int)(arenaSize.Y - size.Y - 50)));
            int borderThickness = rnd.Next(10, 20);

            var rectangle = new Rectangle(position, size, borderThickness);

            var doorCount = rnd.Next(1, 5);
            for (int i = 0; i < doorCount; i++)
            {
                rectangle.AddDoors(rnd);
            }

            return rectangle.Obstacles;
        }

        private class Rectangle
        {
            public List<Obstacle> Obstacles { get; private set; }

            public Rectangle(Vector2d position, Vector2d size, int thickness)
            {
                var points = new Vector2d[] {
                    new Vector2d(position.X, position.Y + size.Y),
                    new Vector2d(position.X + size.X, position.Y + size.Y),
                    new Vector2d(position.X + size.X, position.Y),
                    new Vector2d(position.X, position.Y)
                };
                Obstacles = ToObstacles(points, thickness).ToList();
            }

            public IEnumerable<Obstacle> ToObstacles(Vector2d[] points, int thickness)
            {
                for (int i = 0; i < points.Length; i++)
                {
                    var current = points[i % points.Length];
                    var next = points[(i + 1) % points.Length];

                    int xThickness = 0,
                        yThickness = 0;

                    if (current.Y > next.Y)
                        xThickness = -thickness;
                    else if (current.Y < next.Y)
                        xThickness = thickness;

                    if (current.X < next.X)
                        yThickness = -thickness;
                    else if (current.X > next.X)
                        yThickness = thickness;

                    yield return new Obstacle(
                        new Vector2d(current.X + xThickness, current.Y + yThickness),
                        new Vector2d(current.X, current.Y),
                        new Vector2d(next.X, next.Y),
                        new Vector2d(next.X + xThickness, next.Y + yThickness)
                        );
                }
            }

            public void AddDoors(Random rnd)
            {
                var doorSize = rnd.Next(40, 80);
                int obstacleIndex;
                Obstacle obstacle;
                int maxDistance;

                do
                {
                    obstacleIndex = rnd.Next(0, Obstacles.Count);
                    obstacle = Obstacles[obstacleIndex];

                    var topLeft = obstacle.Points.OrderBy(p => p.X).Take(2).OrderByDescending(p => p.Y).First();
                    var bottomRight = obstacle.Points.OrderByDescending(p => p.X).Take(2).OrderBy(p => p.Y).First();

                    double width = bottomRight.X - topLeft.X;
                    double height = topLeft.Y - bottomRight.Y;
                    maxDistance = (int)Math.Max(width, height) - doorSize;
                }
                while (maxDistance < 0);

                var distance = rnd.Next(1, maxDistance);
                var newObstacles = obstacle.SplitWithSpace(doorSize, distance);

                Obstacles.RemoveAt(obstacleIndex);
                Obstacles.InsertRange(obstacleIndex, newObstacles);
            }
        }
    }

    internal static class ObstacleExtensions
    {
        internal static IEnumerable<Obstacle> SplitWithSpace(this Obstacle obstacle, int spaceSize, int spaceDistance)
        {
            var topLeft = obstacle.Points.OrderBy(p => p.X).Take(2).OrderByDescending(p => p.Y).First();
            var bottomRight = obstacle.Points.OrderByDescending(p => p.X).Take(2).OrderBy(p => p.Y).First();

            double width = bottomRight.X - topLeft.X;
            double height = topLeft.Y - bottomRight.Y;

            if (width > height)
            {
                yield return new Obstacle(
                    topLeft,
                    new Vector2d(topLeft.X + spaceDistance, topLeft.Y),
                    new Vector2d(topLeft.X + spaceDistance, bottomRight.Y),
                    new Vector2d(topLeft.X, bottomRight.Y)
                    );

                yield return new Obstacle(
                    new Vector2d(topLeft.X + spaceDistance + spaceSize, topLeft.Y),
                    new Vector2d(bottomRight.X, topLeft.Y),
                    bottomRight,
                    new Vector2d(topLeft.X + spaceDistance + spaceSize, bottomRight.Y)
                    );
            }
            else
            {
                yield return new Obstacle(
                    topLeft,
                    new Vector2d(bottomRight.X, topLeft.Y),
                    new Vector2d(bottomRight.X, topLeft.Y - spaceDistance),
                    new Vector2d(topLeft.X, topLeft.Y - spaceDistance)
                    );

                yield return new Obstacle(
                    new Vector2d(topLeft.X, topLeft.Y - spaceDistance - spaceSize),
                    new Vector2d(bottomRight.X, topLeft.Y - spaceDistance - spaceSize),
                    bottomRight,
                    new Vector2d(topLeft.X, bottomRight.Y)
                    );
            }
        }
    }
}