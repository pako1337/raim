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
    };
    
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

        var facingDirection = { x: input.mouse.x - p.Position.X, y: input.mouse.y - p.Position.Y };

        var facingDirectionLength = facingDirection.x * facingDirection.x + facingDirection.y * facingDirection.y;
        facingDirectionLength = Math.sqrt(facingDirectionLength);

        facingDirection.x = facingDirection.x / facingDirectionLength;
        facingDirection.y = facingDirection.y / facingDirectionLength;

        playerMoving({ moveDirection: input.direction, facingDirection: facingDirection });
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
            viewport: viewport
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
    };
};