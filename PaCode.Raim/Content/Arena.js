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
        gfx.drawArena(players);
    };

    var playerMoved = function (who) {
        var player = players.get(who.Name);
        player.Position = who.Position;
        gfx.drawArena(players);
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

        gfx = new raimGraphics({ canvas: canvas });

        keyboard = new keyboardInput({
            inputChanged: playerMoving
        });
    })();

    return {
        addNewPlayer: addNewPlayer,
        playerMoved: playerMoved,
    };
};