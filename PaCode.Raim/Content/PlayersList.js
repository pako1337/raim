function playersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';
    var _players = [];

    var addNewPlayer = function (player) {
        _players.push(player);
        printPlayers();
    };

    var removePlayer = function (player) {
        var playerIndex = _players.findIndex(function (p) { return p && p.Id === player; });
        if (playerIndex >= 0)
            _players.splice(playerIndex, 1);

        printPlayers();
    }

    var count = function () {
        return _players.length;
    };

    var updateLeaderboard = function (gameObjects) {
        var list = document.getElementById(playersListElementId);
        var playerListElements = list.getElementsByTagName("span");
        for (var i = 0; i < _players.length; i++) {
            var player = gameObjects.find(function (g) { return _players[i] && g.Id == _players[i].Id; });
            _players[i] = player;
            printPlayers();
        }
    };

    var printPlayers = function () {
        var players = document.getElementById(playersListElementId);
        while (players.firstChild) {
            players.removeChild(players.firstChild);
        }

        _players.sort(function (p1, p2) { return p1.Score - p2.Score; }).reverse();

        for (var i = 0; i < Math.min(_players.length, 10); i++) {
            var player = _players[i];
            if (!player) continue;

            var playerNameElement = document.createElement('span');
            playerNameElement.textContent = player.Name + " " + player.Score;
            playerNameElement.id = player.Id;
            players.appendChild(playerNameElement);
        }
    };

    return {
        addNewPlayer: addNewPlayer,
        removePlayer: removePlayer,
        count: count,
        updateLeaderboard: updateLeaderboard
    };
}