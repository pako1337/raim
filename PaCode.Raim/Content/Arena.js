function arena(args) {
    args = args || {};
    var playerId;
    var players;
    var arenaHandler;
    var playerMoving;
    var singOut;
    var input;
    var gfx;
    var canvas, backgroundCanvas;
    var lastPlayerListUpdate;
    var viewport = { x: 0, y: 0 };
    var arena;
    var playerInput = { keysInput: 0, facingDirection: { X: 0, Y: 0 } },
        previousPlayerInput = { keysInput: 0, facingDirection: { X: 0, Y: 0 } };
    var connected;

    var gameObjects = [];

    var setPlayer = function (p) {
        playerId = p;
        gfx.resizeCanvas();
        connected = true;
        requestAnimationFrame(processFrame);
        input.startListening();
    };

    var setupArena = function (a) {
        arena = a;
    };

    var playerMoved = function (gameObjectsFromServer) {
        var currentPlayer = getCurrentPlayer();
        gameObjects = gameObjectsFromServer;
        if (playerId && !getCurrentPlayer()) {
            playerId = null;
            singOut(currentPlayer);
        }
    };

    var isCurrentPlayerPredicate = function (g) { return g.Id == playerId; };

    var getCurrentPlayer = function () {
        return gameObjects.find(isCurrentPlayerPredicate);
    }

    var inputChange = function (input) {
        var player = getCurrentPlayer();
        if (player == undefined) return;

        var mouseX = Math.round(input.mouse.x / gfx.scale() - viewport.x);
        var mouseY = Math.round(-input.mouse.y / gfx.scale() - viewport.y);

        calculateFacingDirection(player, mouseX, mouseY);

        playerInput.keysInput = input.direction;
        playerInput.facingDirection = player.FacingDirection;
    };

    function calculateFacingDirection(player, mouseX, mouseY) {
        player.FacingDirection.X = Math.round(mouseX - player.Position.X);
        player.FacingDirection.Y = Math.round(mouseY - player.Position.Y);
    }

    var lastTimestamp;
    var processFrame = function (timestamp) {
        if (!connected)
            return;

        if (!lastPlayerListUpdate) {
            lastPlayerListUpdate = timestamp;
        }

        lastTimestamp = lastTimestamp || timestamp;
        var currentPlayer = getCurrentPlayer();
        
        if (playerInput &&
            (playerInput.keysInput != previousPlayerInput.keysInput ||
             playerInput.facingDirection.X != previousPlayerInput.facingDirection.X ||
             playerInput.facingDirection.Y != previousPlayerInput.facingDirection.Y)) {
            previousPlayerInput.keysInput = playerInput.keysInput;
            previousPlayerInput.facingDirection = playerInput.facingDirection;
            playerMoving(playerInput);

            if (currentPlayer)
                updatePlayerSpeed(currentPlayer, playerInput.keysInput);
        }

        var timeDiff = (timestamp - lastTimestamp) / 1000;
        updateObjectsPositions(timeDiff);

        if (currentPlayer !== undefined) {
            viewport.x =  gfx.originalSize.x / 2 - currentPlayer.Position.X;
            viewport.y = -gfx.originalSize.y / 2 - currentPlayer.Position.Y;
        }

        gfx.drawArena(gameObjects);

        if (timestamp - lastPlayerListUpdate > 2000) {
            lastPlayerListUpdate = timestamp;
            players.updateLeaderboard(gameObjects);
        }

        lastTimestamp = timestamp;

        if (connected)
            requestAnimationFrame(processFrame);
    };

    var updatePlayerSpeed = function (player, keys) {
        var speedX = 0,
            speedY = 0;

        if (keys & keysInput.Up)
            speedY = 1;
        if (keys & keysInput.Down)
            speedY = -1;
        if (keys & keysInput.Right)
            speedX = 1;
        if (keys & keysInput.Left)
            speedX = -1;

        if (speedX != 0 || speedY != 0) {
            var speedLength = Math.sqrt(speedX * speedX + speedY * speedY)
            speedX = (speedX / speedLength) * player.MaxSpeed;
            speedY = (speedY / speedLength) * player.MaxSpeed;
        }

        player.Speed.X = speedX;
        player.Speed.Y = speedY;
    };

    var boundingBox = { Top: 0, Right: 0, Bottom: 0, Left: 0 };
    var updateObjectsPositions = function (timeDiff) {
        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];
            var diffX = gameObject.Speed.X * timeDiff;
            var diffY = gameObject.Speed.Y * timeDiff;
            
            boundingBox.Top    = Math.floor(gameObject.BoundingBox.Top + diffY);
            boundingBox.Right  = Math.floor(gameObject.BoundingBox.Right + diffX);
            boundingBox.Bottom = Math.floor(gameObject.BoundingBox.Bottom + diffY);
            boundingBox.Left   = Math.floor(gameObject.BoundingBox.Left + diffX);

            var collisionDetected = false;
            for (var j = 0; j < gameObjects.length; j++) {
                if (i === j) continue;

                var other = gameObjects[j];

                if (isColliding(boundingBox, other.BoundingBox)) {
                    collisionDetected = true;
                    break;
                }
            }

            if (!collisionDetected && arena) {
                for (var j = 0; j < arena.Obstacles.length; j++) {
                    if (isColliding(boundingBox, arena.Obstacles[j].BoundingBox)) {
                        collisionDetected = true;
                        break;
                    }
                }
            }

            if (collisionDetected)
                continue;

            gameObject.Position.X += diffX;
            gameObject.Position.Y += diffY;
        }
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

        gfx = new raimGraphics({
            arenaHandler: arenaHandler,
            viewport: function () { return viewport; },
            arena: function () { return arena; },
        });

        input = new userInput({
            inputChanged: inputChange,
        });
    })();

    var stop = function () {
        connected = false;
        input.stopListening();
    };

    return {
        playerMoved: playerMoved,
        setPlayer: setPlayer,
        setupArena: setupArena,
        getCurrentPlayer: getCurrentPlayer,
        stop: stop
    };
};