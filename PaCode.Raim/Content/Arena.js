function arena(args) {
    args = args || {};
    var playerName;
    var players;
    var arenaHandler;
    var playerMoving;
    var view;
    var keyboard;
    var gfx;

    var setPlayer = function (p) {
        playerName = p;
    }
    
    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
    };

    var playerMoved = function (who) {
        console.log(new Date().getTime());
        var player = players.get(who.Name);
        player.Position = who.Position;
        player.Speed = who.Speed;
    };

    var inputChange = function (input) {
        var p = players.get(playerName);

        var mouse = input.mouse;
        var vector = { x: mouse.x - p.Position.X, y: mouse.y - p.Position.Y };
        var vectorLength = vector.x * vector.x + vector.y * vector.y;
        vectorLength = Math.sqrt(vectorLength);
        vector.x = vector.x / vectorLength;
        vector.y = vector.y / vectorLength;
        var screenVector = { x: 1, y: 0};

        var dotProduct = vector.x * screenVector.x + vector.y * screenVector.y;
        var angle = Math.acos(dotProduct);

        playerMoving({ direction: input.direction, angle: angle });
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

        gfx = new raimGraphics({
            canvas: canvas,
            objects: players
        });

        gfx.startRendering();

        keyboard = new userInput({
            inputChanged: inputChange,
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
    };
};