(function () {
    var raim = $.connection.raimHub;
    var arena = new Arena();

    raim.client.registered = arena.addNewPlayer;

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();