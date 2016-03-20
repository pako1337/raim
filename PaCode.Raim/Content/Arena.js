function Arena(args) {
    args = args || {};
    var players = args.playersList || new PlayersList(args.playersListOptions);

    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
    }

    return {
        addNewPlayer: addNewPlayer,
    };
};