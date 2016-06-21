function arena(args) {
    args = args || {};
    var playerId;
    var players;
    var arenaHandler;
    var playerMoving;
    var singOut;
    var input;
    var gfx;
    var canvas;
    var lastFrameTime;
    var viewport = { x: 0, y: 0 };
    var originalSize = { x: 1600, y: 861 };
    var scale = 1;
    var arena;
    var playerInput,
        previousPlayerInput = { keysInput: 0, facingDirection: { x: 0, y: 0 } };

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
        if (playerId && !getCurrentPlayer()) {
            playerId = null;
            singOut();
        }

        players.updateLeaderboard(gameObjects);
    };

    var getCurrentPlayer = function () {
        return gameObjects.find(function (g) { return g.Id == playerId; });
    }

    var inputChange = function (input) {
        var player = getCurrentPlayer();
        if (player == undefined) return;

        input.mouse.x /= scale;
        input.mouse.y /= scale;
        input.mouse.x = input.mouse.x - viewport.x;
        input.mouse.y = -input.mouse.y - viewport.y;

        player.FacingDirection = calculateFacingDirection(player, input.mouse);
        playerInput = { keysInput: input.direction, facingDirection: player.FacingDirection };
    };

    function calculateFacingDirection(player, mouse) {
        return { X: mouse.x - player.Position.X, Y: mouse.y - player.Position.Y };
    }

    var processFrame = function (timestamp) {
        if (!lastFrameTime)
            lastFrameTime = timestamp;


        if (playerInput &&
            (playerInput.keysInput != previousPlayerInput.keysInput ||
             playerInput.facingDirection.x != previousPlayerInput.facingDirection.x ||
             playerInput.facingDirection.y != previousPlayerInput.facingDirection.y)) {
            previousPlayerInput = playerInput;
            playerMoving(playerInput);
        }

        var timeDiff = (timestamp - lastFrameTime) / 1000;

        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];

            if (!gameObject.IsDestroyed) {
                var directionPoint = { x: gameObject.Position.X + gameObject.FacingDirection.X, y: gameObject.Position.Y + gameObject.FacingDirection.Y };
                gameObject.FacingDirection = calculateFacingDirection(gameObject, directionPoint);

                gameObject.TimeToLive -= timestamp - lastFrameTime;
                if (gameObject.TimeToLive <= 0)
                    gameObject.IsDestroyed = true;
            }
        }

        var currentPlayer = getCurrentPlayer();
        if (currentPlayer !== undefined) {
            viewport.x = originalSize.x / 2 - currentPlayer.Position.X;
            viewport.y = -originalSize.y / 2 - currentPlayer.Position.Y;
        }

        gameObjects = gameObjects.filter(function (g) { return !g.IsDestroyed });

        gfx.drawArena(gameObjects);

        lastFrameTime = timestamp;
        requestAnimationFrame(processFrame);
    };

    var resizeCanvas = function () {
        var arenaElement = document.getElementById(arenaHandler);
        var widthDiff = originalSize.x - arenaElement.offsetWidth;
        var heightDiff = originalSize.y - arenaElement.offsetHeight;

        var aspectRatio = originalSize.x / originalSize.y;
        var w, h;

        if (Math.abs(widthDiff) > Math.abs(heightDiff)) {
            w = arenaElement.offsetWidth;
            h = w / aspectRatio;
        } else {
            h = arenaElement.offsetHeight;
            w = h * aspectRatio;
        }

        canvas.width = w;
        canvas.height = h;

        scale = canvas.width / originalSize.x;
    };

    (function init() {
        arenaHandler = args.arena || "arena";
        players = args.playersList || new playersList(args.playersListOptions);
        playerMoving = args.playerMoving || function () { };
        singOut = args.signOut || function () { };

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
            scale: function () { return scale; },
        });

        requestAnimationFrame(processFrame);

        input = new userInput({
            inputChanged: inputChange,
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