(function () {
    var raim = $.connection.raimHub;
    var gameArena = new arena({
        playerMoving: function (e) {
            raim.server.playerMoving(e);
        }
    });

    raim.client.registered = gameArena.addNewPlayer;
    raim.client.otherPlayers = function (players) {
        for (var i = 0; i < players.length; i++) {
            gameArena.addNewPlayer(players[i]);
        }
    };

    raim.client.playerMoved = gameArena.playerMoved;

    $.connection.hub.start().done(function () {
        var name = Date.now().toString();
        raim.server.register(name);
        gameArena.setPlayer(name);
    });
})();