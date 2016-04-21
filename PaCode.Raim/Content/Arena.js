function arena(args) {
    args = args || {};
    var playerId;
    var players;
    var arenaHandler;
    var playerMoving;
    var input;
    var gfx;
    var lastFrameTime;
    var viewport = { x: 0, y: 0 };

    var gameObjects;

    var setPlayer = function (p) {
        playerId = p;
    };
    
    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
    };

    var removePlayer = function (who) {
        players.removePlayer(who);
    };

    var playerMoved = function (gameObjectsFromServer) {
        gameObjects = gameObjectsFromServer;
    };

    var inputChange = function (input) {
        var player = gameObjects.find(function (g) { return g.Id == playerId; });
        if (player == undefined) return;

        player.FacingDirection = calculateFacingDirection(player, input.mouse);
        playerMoving({ keysInput: input.direction, facingDirection: player.FacingDirection });
    };

    function calculateFacingDirection(player, mouse) {
        return { X: mouse.x - player.Position.X, Y: mouse.y - player.Position.Y };
    }

    var processFrame = function (timestamp) {
        if (!lastFrameTime)
            lastFrameTime = timestamp;
        
        var timeDiff = (timestamp - lastFrameTime) / 1000;

        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];

            if (!gameObject.IsDestroyed) {
                var directionPoint = { x: gameObject.Position.X + gameObject.FacingDirection.X, y: gameObject.Position.Y + gameObject.FacingDirection.Y };
                gameObject.Position.X += gameObject.Speed.X * timeDiff;
                gameObject.Position.Y += gameObject.Speed.Y * timeDiff;
                gameObject.FacingDirection = calculateFacingDirection(gameObject, directionPoint);

                if (!!gameObject.TimeToLive) {
                    gameObject.TimeToLive -= timestamp - lastFrameTime;
                    if (gameObject.TimeToLive <= 0)
                        gameObject.IsDestroyed = true;
                }
            }
        }

        gameObjects = gameObjects.filter(function (g) { return !g.IsDestroyed });

        gfx.drawArena(gameObjects);

        lastFrameTime = timestamp;
        requestAnimationFrame(processFrame);
    };

    (function init() {
        arenaHandler = args.arena || "arena";
        players = args.playersList || new playersList(args.playersListOptions);
        playerMoving = args.playerMoving || function () { };

        gameObjects = [];

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
        });

        requestAnimationFrame(processFrame);

        input = new userInput({
            inputChanged: inputChange,
            viewport: viewport
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        removePlayer: removePlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
    };
};