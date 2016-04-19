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
            UpdateGameState();
            var player = players[Context.ConnectionId];
            var createdObjects = player.ProcessInput(input);
            gameObjects.AddRange(createdObjects);
            Clients.All.PlayerMoved(gameObjects);
        }

        private void UpdateGameState()
        {
            var updateTime = DateTime.Now;

            foreach (var player in gameObjects)
                player.Update(updateTime);
        }
    }
}