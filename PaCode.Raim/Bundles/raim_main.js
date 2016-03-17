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
function PlayersList(args) {
    args = args || {};
    var playersListElementId = args.playersList || 'playersList';

    var addNewPlayer = function (player) {
        var players = document.getElementById(playersListElementId);
        var playerNameElement = document.createElement('span');
        playerNameElement.textContent = player.Name;
        players.appendChild(playerNameElement);
    };

    return {
        addNewPlayer: addNewPlayer
    };
}