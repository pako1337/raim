(function () {
    var raim = $.connection.raimHub;
    var connected = false;

    var gameArena;

    var _playerId;

    raim.client.signedIn = function (id) {
        connected = true;
        _playerId = id;
        gameArena.setPlayer(id);
    };

    raim.client.setupArena = function (arenaData) { gameArena.setupArena(arenaData); };

    raim.client.registered = function (player) { gameArena.addNewPlayer(player); }
    raim.client.signedOff = function (player) { gameArena.removePlayer(player); }
    raim.client.otherPlayers = function (players) {
        for (var i = 0; i < players.length; i++) {
            gameArena.addNewPlayer(players[i]);
        }
    };

    raim.client.playerMoved = function (gameState) { gameArena.playerMoved(gameState); }

    function signOff() {
        console.log("unloading");
        raim.server.signOff(_playerId);
    }

    var playerName = document.getElementById("playerName");
    var playButton = document.getElementById("playButton");

    playerName.addEventListener("keyup", function () {
        if (event.keyCode == 13) playButton.click();
    });
    playerName.value = localStorage.getItem("playerName");

    playButton.addEventListener("click", function () {
        $.connection.hub.start().done(function () {

            document.getElementById("registration").style.display = "none";
            var arenaElement = document.getElementById("arena").style.display = "block";

            gameArena = new arena({
                playerMoving: function (e) {
                    if (!connected) return;

                    raim.server.playerMoving(e);
                },
                signOut: function () {
                    if (!connected) return;

                    $.connection.hub.stop();
                    connected = false;
                    document.getElementById("registration").style.display = "block";
                    document.getElementById("playerName").focus();
                    var arenaElement = document.getElementById("arena");
                    arenaElement.style.display = "none";
                    while (arenaElement.firstChild) {
                        arenaElement.removeChild(arenaElement.firstChild);
                    }
                }
            });

            var name = playerName.value || "random player";
            localStorage.setItem("playerName", name);

            raim.server.register(name);

            window.addEventListener("beforeunload", signOff);
        });
    });
})();