(function () {
    var raim = $.connection.raimHub;
    var gameArena = new arena({
        playerMoving: function (e) {
            raim.server.playerMoving(e.direction);
        }
    });

    raim.client.registered = gameArena.addNewPlayer;
    raim.client.playerMoved = gameArena.playerMoved;

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();