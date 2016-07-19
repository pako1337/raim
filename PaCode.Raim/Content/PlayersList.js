function playersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';

    var updateLeaderboard = function (gameObjects) {
        var list = document.getElementById(playersListElementId);
        var playerListElements = list.getElementsByTagName("span");

        var players = gameObjects.filter(playerPredicate);
        printPlayers(players);
    };

    function playerPredicate(p) {
        return p.Score != null && p.Score != undefined;
    }

    function playerSortComparer(p1, p2) {
        return p1.Score - p2.Score;
    }

    var printPlayers = function (playersList) {
        var players = document.getElementById(playersListElementId);
        while (players.firstChild) {
            players.removeChild(players.firstChild);
        }

        playersList.sort(playerSortComparer).reverse();

        for (var i = 0; i < Math.min(playersList.length, 10); i++) {
            var player = playersList[i];
            if (!player) continue;

            var playerNameElement = document.createElement('span');
            playerNameElement.textContent = player.Name + " " + player.Score;
            playerNameElement.id = player.Id;
            players.appendChild(playerNameElement);
        }
    };

    return {
        updateLeaderboard: updateLeaderboard
    };
}