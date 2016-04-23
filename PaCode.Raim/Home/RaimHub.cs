using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Nancy.Helpers;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class RaimHub : Hub
    {
        private static Dictionary<string, Player> players = new Dictionary<string, Player>();
        private static List<IGameObject> gameObjects = new List<IGameObject>();

        public void Register(string name)
        {
            name = HttpUtility.HtmlEncode(name);
            var player = Player.Create(name, 250, 250);
            players.Add(Context.ConnectionId, player);
            gameObjects.Add(player);
            Clients.Caller.SignedIn(player.Id);
            Clients.All.Registered(player);
            Clients.Caller.OtherPlayers(players.Values.Where(p => p.Name != name));

            UpdateGameState();
            Clients.All.PlayerMoved(gameObjects);
        }

        public void SignOff()
        {
            var player = players[Context.ConnectionId];
            players.Remove(Context.ConnectionId);
            gameObjects.RemoveAll(g => player.Bullets.Any(b => b.Id == g.Id));
            gameObjects.RemoveAll(g => g.Id == player.Id);
            Clients.All.SignedOff(player.Name);

            UpdateGameState();
            Clients.All.PlayerMoved(gameObjects);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            SignOff();
            return base.OnDisconnected(stopCalled);
        }

        public void PlayerMoving(PlayerInput input)
        {
            var updateTime = DateTime.Now;
            UpdateGameState(updateTime);
            var player = players[Context.ConnectionId];
            var createdObjects = player.ProcessInput(input, updateTime);
            gameObjects.AddRange(createdObjects);
            Clients.All.PlayerMoved(gameObjects);
        }

        private void UpdateGameState(DateTime? updateTimestamp = null)
        {
            UpdatePositions(updateTimestamp);
            CalculateCollisions();

            gameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);
        }

        private static DateTime _lastUpdateTime = DateTime.Now;
        private void UpdatePositions(DateTime? updateTimestamp)
        {
            var updateTime = updateTimestamp ?? DateTime.Now;

            var timeBetweenEvents = updateTime - _lastUpdateTime;

            foreach (var gameObject in gameObjects)
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

        private void CalculateCollisions()
        {
            foreach (var o1 in gameObjects)
                foreach (var o2 in gameObjects)
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