(function () {
    var raim = $.connection.raimHub;
    var arena = new Arena({
        playerMoving: function (e) {
            raim.server.playerMoving(e.direction);
        }
    });

    raim.client.registered = arena.addNewPlayer;
    raim.client.playerMoved = arena.playerMoved;

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();