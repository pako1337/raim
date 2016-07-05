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

    var gameObjects;

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
        gameObjects = gameObjectsFromServer;
        if (playerId && !getCurrentPlayer()) {
            playerId = null;
            singOut();
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

    var processFrame = function (timestamp) {
        if (!lastPlayerListUpdate) {
            lastPlayerListUpdate = timestamp;
        }

        if (playerInput &&
            (playerInput.keysInput != previousPlayerInput.keysInput ||
             playerInput.facingDirection.X != previousPlayerInput.facingDirection.X ||
             playerInput.facingDirection.Y != previousPlayerInput.facingDirection.Y)) {
            previousPlayerInput = playerInput;
            playerMoving(playerInput);
        }

        var currentPlayer = getCurrentPlayer();
        if (currentPlayer !== undefined) {
            viewport.x = gfx.originalSize.x / 2 - currentPlayer.Position.X;
            viewport.y = -gfx.originalSize.y / 2 - currentPlayer.Position.Y;
        }

        gfx.drawArena(gameObjects);

        if (timestamp - lastPlayerListUpdate > 2000) {
            lastPlayerListUpdate = timestamp;
            players.updateLeaderboard(gameObjects);
        }

        if (connected)
            requestAnimationFrame(processFrame);
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
        stop: stop
    };
};