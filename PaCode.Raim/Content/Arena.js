function Arena(args) {
    args = args || {};
    var players;
    var arenaHandler = args.arena || "arena";
    var arena = document.getElementById(arenaHandler);
    var drawingContext;

    var keyDown = function (e) {
        console.log(e.keyCode);
    };

    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
        drawingContext.strokeStyle = "#F00";
        drawingContext.fillStyle = "#F00";
        drawingContext.arc(who.Position.X, who.Position.Y, who.Size, 0, 2 * Math.PI);
        drawingContext.stroke();
        drawingContext.fill();
    };

    (function init() {
        players = args.playersList || new PlayersList(args.playersListOptions);

        var canvas = document.createElement("canvas");
        arena.appendChild(canvas);

        drawingContext = canvas.getContext("2d");

        document.addEventListener("keydown", keyDown);
    })();

    return {
        addNewPlayer: addNewPlayer,
    };
};