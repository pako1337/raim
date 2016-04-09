function arena(args) {
    args = args || {};
    var playerName;
    var players;
    var arenaHandler;
    var playerMoving;
    var input;
    var gfx;
    var viewport = { x: 0, y: 0 };

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
        var vector = {
            x: (mouse.x - gfx.viewport.x) - p.Position.X,
            y: -(mouse.y - gfx.viewport.y) - p.Position.Y
        }; // invert y axis input

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
        viewport.x = 0;
        viewport.y = arenaElement.offsetHeight;

        var canvas = document.createElement("canvas");
        canvas.width = arenaElement.offsetWidth;
        canvas.height = arenaElement.offsetHeight;
        document.getElementById(arenaHandler).appendChild(canvas);

        gfx = new raimGraphics({
            canvas: canvas,
            viewport: viewport,
            objects: players
        });

        gfx.startRendering();

        input = new userInput({
            inputChanged: inputChange,
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
    };
};