(function () {
    var raim = $.connection.raimHub;
    var playersList = new PlayersList();

    raim.client.registered = function (who) {
        playersList.addNewPlayer(who);
    };

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();