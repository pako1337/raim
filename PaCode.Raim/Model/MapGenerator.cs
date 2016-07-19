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

        public Arena FromFile()
        {
            var obstacles = new List<Obstacle>(10);
            Vector2d arenaSize = null;

            using (var reader = new StreamReader(Path.Combine(Directory.GetCurrentDirectory(), "ArenaDefinitions/build1.txt")))
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

            obstacles.AddRange(GetBorder(arenaSize));

            return new Arena(arenaSize, obstacles, (byte)(Math.Max(arenaSize.X, arenaSize.Y)/100));
        }

        public Arena Generate(Vector2d arenaSize)
        {
            var obstacles = new List<Obstacle>(8);
            obstacles.AddRange(GetBorder(arenaSize));

            var rectangles = new List<Rectangle>();

            var obstaclesCount = rnd.Next(3, 8);
            for (int i = 0; i < obstaclesCount; i++)
            {
                Rectangle rectangle = null;
                int tries = 0;
                const int maxTries = 150;

                do
                {
                    rectangle = GenerateObstacle(arenaSize, new Vector2d(290 - tries, 290 - tries));
                    tries++;
                }
                while (rectangles.Any(r => r.Collide(rectangle) && tries <= maxTries));

                if (tries > maxTries) continue;

                rectangles.Add(rectangle);
            }

            var smallObstacles = rnd.Next(10, 20);
            Vector2d minSize = new Vector2d(15, 15);
            for (int i = 0; i < smallObstacles; i++)
            {
                int tries = 0;
                const int maxTries = 100;
                Rectangle rectangle = null;

                do
                {
                    var size = new Vector2d(rnd.Next((int)minSize.X, (int)minSize.X * 5), rnd.Next((int)minSize.Y, (int)minSize.Y * 5));
                    var position = new Vector2d(rnd.Next(50, (int)(arenaSize.X - size.X - 50)), rnd.Next(50, (int)(arenaSize.Y - size.Y - 50)));

                    rectangle = new Rectangle(position, size);
                    tries++;
                }
                while (rectangles.Any(r => r.Collide(rectangle)) && tries < maxTries);
                
                if (rectangle != null)
                    rectangles.Add(rectangle);
            }

            obstacles.AddRange(rectangles.SelectMany(r => r.Obstacles));

            return new Arena(arenaSize, obstacles, (byte)(Math.Max(arenaSize.X, arenaSize.Y)/100));
        }

        private Rectangle GenerateObstacle(Vector2d arenaSize, Vector2d minSize)
        {
            var size = new Vector2d(rnd.Next((int)minSize.X, (int)minSize.X * 2), rnd.Next((int)minSize.Y, (int)minSize.Y * 2));
            var position = new Vector2d(rnd.Next(50, (int)(arenaSize.X - size.X - 50)), rnd.Next(50, (int)(arenaSize.Y - size.Y - 50)));
            int borderThickness = rnd.Next(10, 20);

            var rectangle = new Rectangle(position, size, borderThickness);

            var doorCount = rnd.Next(2, 6);
            rectangle.AddDoors(rnd, doorCount);

            return rectangle;
        }

        private static List<Obstacle> GetBorder(Vector2d arenaSize)
        {
            int borderMargin = 700;
            return new List<Obstacle>() {
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
            };
        }

        private class Rectangle
        {
            private const int margin = 20;

            public List<Obstacle> Obstacles { get; private set; }

            public double Top { get; private set; }
            public double Right { get; private set; }
            public double Bottom { get; private set; }
            public double Left { get; private set; }

            public Rectangle(Vector2d position, Vector2d size, int thickness)
            {
                var points = new Vector2d[] {
                    new Vector2d(position.X, position.Y + size.Y),
                    new Vector2d(position.X + size.X, position.Y + size.Y),
                    new Vector2d(position.X + size.X, position.Y),
                    new Vector2d(position.X, position.Y)
                };
                Obstacles = ToObstacles(points, thickness).ToList();

                Top = points.Max(p => p.Y) + margin;
                Bottom = points.Min(p => p.Y) - margin;
                Left = points.Min(p => p.X) - margin;
                Right = points.Max(p => p.X) + margin;
            }

            public Rectangle(Vector2d position, Vector2d size)
            {
                Obstacles = new List<Obstacle>() { new Obstacle(
                    position,
                    new Vector2d(position.X, position.Y  +size.Y),
                    new Vector2d(position.X + size.X, position.Y + size.Y),
                    new Vector2d(position.X  +size.X, position.Y)
                    )};

                Top = position.Y + size.Y + margin;
                Bottom = position.Y - margin;
                Left = position.X - margin;
                Right = position.X + size.X + margin;
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

            public void AddDoors(Random rnd, int doorCount)
            {
                const int minDistance = margin;

                for (int i = 0; i < doorCount; i++)
                {
                    var doorSize = rnd.Next(40, 80);
                    int obstacleIndex;
                    Obstacle obstacle;
                    int maxDistance;

                    int tries = 0;
                    int maxTries = 100;

                    do
                    {
                        obstacleIndex = rnd.Next(0, Obstacles.Count);
                        obstacle = Obstacles[obstacleIndex];

                        var topLeft = obstacle.Points.OrderBy(p => p.X).Take(2).OrderByDescending(p => p.Y).First();
                        var bottomRight = obstacle.Points.OrderByDescending(p => p.X).Take(2).OrderBy(p => p.Y).First();

                        double width = bottomRight.X - topLeft.X;
                        double height = topLeft.Y - bottomRight.Y;
                        maxDistance = (int)Math.Max(width, height) - minDistance - doorSize;
                        tries++;
                    }
                    while (maxDistance <= minDistance && tries <= maxTries);

                    if (tries > maxTries) continue;

                    var distance = rnd.Next(minDistance, maxDistance);
                    var newObstacles = obstacle.SplitWithSpace(doorSize, distance);

                    Obstacles.RemoveAt(obstacleIndex);
                    Obstacles.InsertRange(obstacleIndex, newObstacles);
                }
            }

            public bool Collide(Rectangle other)
            {
                return !(other.Left > Right ||
                         other.Right < Left ||
                         other.Top < Bottom ||
                         other.Bottom > Top);
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