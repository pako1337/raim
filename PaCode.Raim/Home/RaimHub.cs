using System;
using System.Collections.Generic;
using System.Linq;
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
            Clients.All.Registered(player);
            Clients.Caller.OtherPlayers(players.Values.Where(p => p.Name != name));
        }

        public void SignOff(string name)
        {
            players.Remove(Context.ConnectionId);
            Clients.All.SignedOff(name);
        }

        public void PlayerMoving(PlayerInput input)
        {
            UpdatePlayers();
            var player = players[Context.ConnectionId];
            var createdObjects = player.ProcessInput(input);
            gameObjects.AddRange(createdObjects);
            Clients.All.PlayerMoved(player, createdObjects);
        }

        private void UpdatePlayers()
        {
            var updateTime = DateTime.Now;

            foreach (var player in players.Values)
                player.Update(updateTime);
        }
    }
}