function arena(args) {
    args = args || {};
    var players;
    var arenaHandler;
    var playerMoving;
    var view;
    var keyboard;
    var gfx;
    
    var addNewPlayer = function (who) {
        players.addNewPlayer(who);
    };

    var playerMoved = function (who) {
        var player = players.get(who.Name);
        player.Position = who.Position;
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

        keyboard = new keyboardInput({
            inputChanged: playerMoving
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
    };
};