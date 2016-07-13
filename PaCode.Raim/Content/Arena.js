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
    var playerInput,
        previousPlayerInput = { keysInput: 0, facingDirection: { x: 0, y: 0 } };
    var connected;

    var gameObjects = [];

    var setPlayer = function (p) {
        playerId = p;
        gfx.resizeCanvas();
        connected = true;
        requestAnimationFrame(processFrame);
        input.startListening();
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
        var currentPlayer = getCurrentPlayer();
        gameObjects = gameObjectsFromServer;
        if (playerId && !getCurrentPlayer()) {
            playerId = null;
            singOut(currentPlayer);
        }
    };

    var getCurrentPlayer = function () {
        return gameObjects.find(function (g) { return g.Id == playerId; });
    }

    var inputChange = function (input) {
        var player = getCurrentPlayer();
        if (player == undefined) return;

        input.mouse.x /= gfx.scale();
        input.mouse.y /= gfx.scale();
        input.mouse.x = Math.round(input.mouse.x - viewport.x);
        input.mouse.y = Math.round(-input.mouse.y - viewport.y);

        player.FacingDirection = calculateFacingDirection(player, input.mouse);
        playerInput = { keysInput: input.direction, facingDirection: player.FacingDirection };
    };

    function calculateFacingDirection(player, mouse) {
        var facingDir = {
            X: Math.round(mouse.x - player.Position.X),
            Y: Math.round(mouse.y - player.Position.Y)
        };

        return facingDir;
    }

    var lastTimestamp;
    var processFrame = function (timestamp) {
        if (!lastPlayerListUpdate) {
            lastPlayerListUpdate = timestamp;
        }

        lastTimestamp = lastTimestamp || timestamp;
        var currentPlayer = getCurrentPlayer();
        
        if (playerInput &&
            (playerInput.keysInput != previousPlayerInput.keysInput ||
             playerInput.facingDirection.X != previousPlayerInput.facingDirection.X ||
             playerInput.facingDirection.Y != previousPlayerInput.facingDirection.Y)) {
            previousPlayerInput = playerInput;
            playerMoving(playerInput);

            if (currentPlayer)
                updatePlayerSpeed(currentPlayer, playerInput.keysInput);
        }

        var timeDiff = (timestamp - lastTimestamp) / 1000;
        updateObjectsPositions(timeDiff);

        if (currentPlayer !== undefined) {
            viewport.x = gfx.originalSize.x / 2 - currentPlayer.Position.X;
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
        var speed = { X: 0, Y: 0 };

        if (keys & keysInput.Up)
            speed.Y = 1;
        if (keys & keysInput.Down)
            speed.Y = -1;
        if (keys & keysInput.Right)
            speed.X = 1;
        if (keys & keysInput.Left)
            speed.X = -1;

        if (speed.X != 0 || speed.Y != 0) {
            var speedLength = Math.sqrt(speed.X * speed.X + speed.Y * speed.Y)
            speed.X = (speed.X / speedLength) * player.MaxSpeed;
            speed.Y = (speed.Y / speedLength) * player.MaxSpeed;
        }

        player.Speed = speed;
    };

    var updateObjectsPositions = function (timeDiff) {
        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];
            var diffX = gameObject.Speed.X * timeDiff;
            var diffY = gameObject.Speed.Y * timeDiff;

            var boundingBox = {
                Top: gameObject.BoundingBox.Top + diffY,
                Right: gameObject.BoundingBox.Right + diffX,
                Bottom: gameObject.BoundingBox.Bottom + diffY,
                Left: gameObject.BoundingBox.Left + diffX
            };

            var collisionDetected = false;
            for (var j = 0; j < gameObjects.length; j++) {
                if (i === j) continue;

                var other = gameObjects[j];

                if (isColliding(boundingBox, other.BoundingBox)) {
                    collisionDetected = true;
                    break;
                }
            }

            if (!collisionDetected) {
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
        addNewPlayer: addNewPlayer,
        removePlayer: removePlayer,
        playerMoved: playerMoved,
        setPlayer: setPlayer,
        setupArena: setupArena,
        getCurrentPlayer: getCurrentPlayer,
        stop: stop
    };
};