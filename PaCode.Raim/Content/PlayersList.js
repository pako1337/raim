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