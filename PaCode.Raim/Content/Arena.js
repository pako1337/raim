function Arena(args) {
    args = args || {};
    var players;
    var arenaHandler = args.arena || "arena";
    var arena = document.getElementById(arenaHandler);
    var drawingContext;

    var inputCodes = {
        Up: 1,
        Down: 2,
        Left: 4,
        Right: 8
    };

    var keyDown = function (e) {
        switch (e.which) {
            case 87:
            case 119:
            case 38:
                console.log("up");
                break;
            case 83:
            case 115:
            case 40:
                console.log('down');
                break;
            case 65:
            case 97:
            case 37:
                console.log("left");
                break;
            case 68:
            case 100:
            case 39:
                console.log('right');
                break;
            default:
                console.log("unwanted key");
        }
    };

    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
        drawArena();
    };

    var drawArena = function () {
        for (var i = 0; i < players.count() ; i++) {
            var player = players.get(i);

            drawingContext.strokeStyle = "#F00";
            drawingContext.fillStyle = "#F00";
            drawingContext.arc(player.Position.X, player.Position.Y, player.Size, 0, 2 * Math.PI);
            drawingContext.stroke();
            drawingContext.fill();
        }
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