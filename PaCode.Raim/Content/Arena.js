function arena(args) {
    args = args || {};
    var playerId;
    var players;
    var arenaHandler;
    var playerMoving;
    var input;
    var gfx;
    var canvas;
    var lastFrameTime;
    var viewport = { x: 0, y: 0 };
    var originalScale = { x: 1600, y: 861 };
    var arena;

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

    var setupArena = function (a) {
        arena = a;
    };

    var playerMoved = function (gameObjectsFromServer) {
        gameObjects = gameObjectsFromServer;
        players.updateLeaderboard(gameObjects);
    };

    var getCurrentPlayer = function () {
        return gameObjects.find(function (g) { return g.Id == playerId; });
    }

    var inputChange = function (input) {
        var player = getCurrentPlayer();
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
                //gameObject.Position.X += gameObject.Speed.X * timeDiff;
                //gameObject.Position.Y += gameObject.Speed.Y * timeDiff;
                gameObject.FacingDirection = calculateFacingDirection(gameObject, directionPoint);

                gameObject.TimeToLive -= timestamp - lastFrameTime;
                if (gameObject.TimeToLive <= 0)
                    gameObject.IsDestroyed = true;
            }
        }

        var currentPlayer = getCurrentPlayer();
        if (currentPlayer !== undefined) {
            viewport.x = canvas.width / 2 - currentPlayer.Position.X;
            viewport.y = -canvas.height / 2 - currentPlayer.Position.Y;
        }

        gameObjects = gameObjects.filter(function (g) { return !g.IsDestroyed });

        gfx.drawArena(gameObjects);

        lastFrameTime = timestamp;
        requestAnimationFrame(processFrame);
    };

    var resizeCanvas = function () {
        var arenaElement = document.getElementById(arenaHandler);
        var widthDiff = originalScale.x - arenaElement.offsetWidth;
        var heightDiff = originalScale.y - arenaElement.offsetHeight;

        var scale = originalScale.x / originalScale.y;
        var w, h;

        if (Math.abs(widthDiff) > Math.abs(heightDiff)) {
            w = arenaElement.offsetWidth;
            h = w / scale;
        } else {
            h = arenaElement.offsetHeight;
            w = h * scale;
        }

        canvas.width = w;
        canvas.height = h;
    };

    (function init() {
        arenaHandler = args.arena || "arena";
        players = args.playersList || new playersList(args.playersListOptions);
        playerMoving = args.playerMoving || function () { };

        gameObjects = [];

        var arenaElement = document.getElementById(arenaHandler);
        viewport.x = 0;
        viewport.y = arenaElement.offsetHeight;

        canvas = document.createElement("canvas");
        document.getElementById(arenaHandler).appendChild(canvas);
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);

        gfx = new raimGraphics({
            canvas: function () { return canvas; },
            viewport: function () { return viewport; },
            arena: function () { return arena; },
            originalScale: originalScale
        });

        requestAnimationFrame(processFrame);

        input = new userInput({
            inputChanged: inputChange,
            viewport: function () { return viewport; }
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        removePlayer: removePlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
        setupArena: setupArena
    };
};