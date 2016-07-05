using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class MapGenerator
    {
        private readonly Random rnd = new Random();

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

            // coordinates in TRouBLe
            var topBorder = new Obstacle(
                new Vector2d(position.X, position.Y + size.Y),
                new Vector2d(position.X + size.X, position.Y + size.Y),
                new Vector2d(position.X + size.X, position.Y + size.Y - borderThickness),
                new Vector2d(position.X, position.Y + size.Y - borderThickness)
                );

            var rightBorder = new Obstacle(
                new Vector2d(position.X + size.X - borderThickness, position.Y + size.Y),
                new Vector2d(position.X + size.X, position.Y + size.Y),
                new Vector2d(position.X + size.X, position.Y),
                new Vector2d(position.X + size.X - borderThickness, position.Y)
                );

            var bottomBorder = new Obstacle(
                new Vector2d(position.X, position.Y + borderThickness),
                new Vector2d(position.X + size.X, position.Y + borderThickness),
                new Vector2d(position.X + size.X, position.Y),
                new Vector2d(position.X, position.Y));

            var leftBorder = new Obstacle(
                new Vector2d(position.X, position.Y + size.Y),
                new Vector2d(position.X + borderThickness, position.Y + size.Y),
                new Vector2d(position.X + borderThickness, position.Y),
                new Vector2d(position.X, position.Y));

            yield return topBorder;
            yield return rightBorder;
            yield return bottomBorder;
            yield return leftBorder;
        }
    }
}