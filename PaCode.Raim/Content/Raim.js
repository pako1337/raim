(function () {
    var raim = $.connection.raimHub;
    raim.client.registered = function (who) {
        var players = document.getElementById('playersList');
        var playerNameElement = document.createElement('span');
        playerNameElement.textContent = who;
        players.appendChild(playerNameElement);
    };

    $.connection.hub.start().done(function () {
        raim.server.register("Pako");
    });
})();