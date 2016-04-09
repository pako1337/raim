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

        public void Register(string name)
        {
            name = HttpUtility.HtmlEncode(name);
            var player = Player.Create(name, 250, 250);
            players.Add(Context.ConnectionId, player);
            Clients.All.Registered(player);
        }

        public void PlayerMoving(PlayerInput input)
        {
            UpdatePlayers();
            var player = players[Context.ConnectionId];
            player.ProcessInput(input);
            Clients.All.PlayerMoved(player);
        }

        private void UpdatePlayers()
        {
            var updateTime = DateTime.Now;

            foreach (var player in players.Values)
                player.Update(updateTime);
        }
    }
}