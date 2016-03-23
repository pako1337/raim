(function () {
    var raim = $.connection.raimHub;
    var arena = new Arena({
        playerMoving: function (e) {
            console.log(e.direction);
        }
    });

    raim.client.registered = arena.addNewPlayer;

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();