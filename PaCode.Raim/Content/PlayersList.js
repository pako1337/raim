function playersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';
    var _players = [];

    var addNewPlayer = function (player) {
        _players.push(player);

        var players = document.getElementById(playersListElementId);
        var playerNameElement = document.createElement('span');
        playerNameElement.textContent = player.Name;
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

    return {
        addNewPlayer: addNewPlayer,
        removePlayer: removePlayer,
        count: count,
        get: get
    };
}