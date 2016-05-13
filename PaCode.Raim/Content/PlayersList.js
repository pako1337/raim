function playersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';
    var _players = [];

    var addNewPlayer = function (player) {
        _players.push(player);

        var players = document.getElementById(playersListElementId);
        var playerNameElement = document.createElement('span');
        playerNameElement.textContent = player.Name;
        playerNameElement.id = player.Id;
        players.appendChild(playerNameElement);
    };

    var removePlayer = function (player) {
        var playerIndex = _players.findIndex(function (p) { return p.Name === player; });
        _players.splice(playerIndex, 1);
    }

    var count = function () {
        return _players.length;
    };

    var get = function (i) {
        if (typeof i == 'number')
            return _players[i];

        return _players.filter(function (p) { return p.Name === i; })[0];
    };

    var updateLeaderboard = function (gameObjects) {
        var playersList = document.getElementById(playersListElementId);
        var playerListElements = playersList.getElementsByTagName("span");
        for (var i = 0; i < _players.length; i++) {
            _players[i] = gameObjects.find(function (g) { return g.Id == _players[i].Id; });
            var playerListElement = playerListElements[i];
            playerListElement.textContent = _players[i].Name + " " + _players[i].Score;
            playerListElement.id = _players[i].Id;
        }

        for (var i = _players.length; i < playerListElements.length; i++) {
            playersList.removeChild(playerListElements[i]);
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