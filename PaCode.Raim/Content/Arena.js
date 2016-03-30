function Arena(args) {
    args = args || {};
    var players;
    var arenaHandler;
    var drawingContext;
    var playerMoving;
    var view;

    var keyDown = function (e) {
        var key = 0;
        if (e.which === 87 || e.which === 119 || e.which === 38)
            key |= moveDirections.Up;

        if (e.which === 83 || e.which === 115 || e.which === 40)
            key |= moveDirections.Down;

        if (e.which === 65 || e.which === 97 || e.which === 37)
            key |= moveDirections.Left;

        if (e.which === 68 || e.which === 100 || e.which === 39)
            key |= moveDirections.Right;

        if (key > 0)
            playerMoving({ direction: key });
    };

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
        players = args.playersList || new PlayersList(args.playersListOptions);
        playerMoving = args.playerMoving || function () { };

        var arenaElement = document.getElementById(arenaHandler);
        view = { width: arenaElement.offsetWidth, height: arenaElement.offsetHeight };

        var canvas = document.createElement("canvas");
        canvas.width = view.width;
        canvas.height = view.height;
        document.getElementById(arenaHandler).appendChild(canvas);

        drawingContext = canvas.getContext("2d");

        document.addEventListener("keydown", keyDown);
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
    };
};