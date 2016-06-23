(function () {
    var raim = $.connection.raimHub;
    var connected = false;

    var gameArena = new arena({
        playerMoving: function (e) {
            if (!connected) return;

            raim.server.playerMoving(e);
        },
        signOut: function () {
            if (!connected) return;

            $.connection.hub.stop();
            connected = false;
            document.getElementById("registration").style.display = "block";
            var arenaElement = document.getElementById("arena").style.display = "none";
        }
    });

    var _playerId;

    raim.client.signedIn = function (id) {
        connected = true;
        _playerId = id;
        gameArena.setPlayer(id);
    };

    raim.client.setupArena = gameArena.setupArena;

    raim.client.registered = gameArena.addNewPlayer;
    raim.client.signedOff = gameArena.removePlayer;
    raim.client.otherPlayers = function (players) {
        for (var i = 0; i < players.length; i++) {
            gameArena.addNewPlayer(players[i]);
        }
    };

    raim.client.playerMoved = gameArena.playerMoved;

    function signOff() {
        console.log("unloading");
        raim.server.signOff(_playerId);
    }

    document.getElementById("playButton").addEventListener("click", function () {
        $.connection.hub.start().done(function () {
            var nameInput = document.getElementById("playerName");
            document.getElementById("registration").style.display = "none";
            var arenaElement = document.getElementById("arena").style.display = "block";
            var name = nameInput.value || "random player";
            raim.server.register(name);

            window.addEventListener("beforeunload", signOff);
        });
    });
})();