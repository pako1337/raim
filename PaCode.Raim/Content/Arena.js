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
        var player = players.get(who.Name);
        player.Position = who.Position;
        player.Speed = who.Speed;
        player.FacingDirection = who.FacingDirection;
    };

    var inputChange = function (input) {
        var p = players.get(playerName);
        if (p == undefined) return;

        var mouse = input.mouse;
        var vector = { x: mouse.x - p.Position.X, y: -mouse.y - p.Position.Y }; // invert y axis input

        var vectorLength = vector.x * vector.x + vector.y * vector.y;
        vectorLength = Math.sqrt(vectorLength);

        vector.x = vector.x / vectorLength;
        vector.y = vector.y / vectorLength;

        playerMoving({ moveDirection: input.direction, facingDirection: vector });
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