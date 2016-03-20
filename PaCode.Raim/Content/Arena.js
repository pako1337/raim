function Arena(args) {
    args = args || {};
    var players = args.playersList || new PlayersList(args.playersListOptions);
    var arenaHandler = args.arena || "arena";
    var arena = document.getElementById(arenaHandler);
    var drawingContext;

    (function init() {
        var canvas = document.createElement("canvas");
        arena.appendChild(canvas);

        drawingContext = canvas.getContext("2d");
    })();

    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
        drawingContext.strokeStyle = "#F00";
        drawingContext.fillStyle = "#F00";
        drawingContext.arc(who.X + 10, who.Y + 10, 10, 0, 2 * Math.PI);
        drawingContext.stroke();
        drawingContext.fill();
    }

    return {
        addNewPlayer: addNewPlayer,
    };
};