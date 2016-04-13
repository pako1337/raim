(function () {
    var raim = $.connection.raimHub;
    var gameArena = new arena({
        playerMoving: function (e) {
            raim.server.playerMoving(e);
        }
    });

    raim.client.registered = gameArena.addNewPlayer;
    raim.client.signedOff = gameArena.removePlayer;
    raim.client.otherPlayers = function (players) {
        for (var i = 0; i < players.length; i++) {
            gameArena.addNewPlayer(players[i]);
        }
    };

    raim.client.playerMoved = gameArena.playerMoved;

    var name;

    function signOff() {
        console.log("unloading");
        raim.server.signOff(name);
    }

    $.connection.hub.start().done(function () {
        name = Date.now().toString();
        raim.server.register(name);
        gameArena.setPlayer(name);

        window.addEventListener("beforeunload", signOff);
    });
})();