+function playersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';
    var _players = [];

    var addNewPlayer = function (player) {
        _players.push(player);
        printPlayers();
    };

    var removePlayer = function (player) {
        var playerIndex = _players.findIndex(function (p) { return p && p.Name === player; });
        _players.splice(playerIndex, 1);
        printPlayers();
    }

    var count = function () {
        return _players.length;
    };

    var get = function (i) {
        if (typeof i == 'number')
            return _players[i];

        return _players.filter(function (p) { return p && p.Name === i; })[0];
    };

    var updateLeaderboard = function (gameObjects) {
        var playersList = document.getElementById(playersListElementId);
        var playerListElements = playersList.getElementsByTagName("span");
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

        for (var i = 0; i < _players.length; i++) {
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
        get: get,
        updateLeaderboard: updateLeaderboard
    };
}