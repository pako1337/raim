﻿function PlayersList(args) {
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
        count: count,
        get: get
    };
}