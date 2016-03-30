function arena(args) {
    args = args || {};
    var players;
    var arenaHandler;
    var drawingContext;
    var playerMoving;
    var view;
    var keyboard;
    
    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
        drawArena();
    };

    var playerMoved = function (who) {
        var player = players.get(who.Name);
        player.Position = who.Position;
        drawArena();
    };

    var drawArena = function () {
        drawingContext.clearRect(0, 0, view.width, view.height);

        for (var i = 0; i < players.count() ; i++) {
            var player = players.get(i);

            drawingContext.beginPath();
            drawingContext.strokeStyle = "#F00";
            drawingContext.fillStyle = "#F00";
            drawingContext.arc(player.Position.X, player.Position.Y, player.Size, 0, 2 * Math.PI);
            drawingContext.stroke();
            drawingContext.fill();
            drawingContext.closePath();
        }
    };

    (function init() {
        arenaHandler = args.arena || "arena";
        players = args.playersList || new playersList(args.playersListOptions);
        playerMoving = args.playerMoving || function () { };

        var arenaElement = document.getElementById(arenaHandler);
        view = { width: arenaElement.offsetWidth, height: arenaElement.offsetHeight };

        var canvas = document.createElement("canvas");
        canvas.width = view.width;
        canvas.height = view.height;
        document.getElementById(arenaHandler).appendChild(canvas);

        drawingContext = canvas.getContext("2d");

        keyboard = new keyboardInput({
            inputChanged: playerMoving
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
    };
};