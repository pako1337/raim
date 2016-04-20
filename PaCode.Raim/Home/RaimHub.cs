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
            var updateTime = updateTimestamp ?? DateTime.Now;
            
            foreach (var gameObject in gameObjects)
                gameObject.Update(updateTime);
            
            gameObjects.RemoveAll(g => g is IDestroyable && ((IDestroyable)g).IsDestroyed);
        }
    }
}