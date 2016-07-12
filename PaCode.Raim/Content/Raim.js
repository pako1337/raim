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
    raim.client.signedOff = function (player) {
        if (player.Id == _playerId) {
            updateHighestScore(player.Score)
        }

        gameArena.removePlayer(player.id);
    }
    raim.client.otherPlayers = function (players) {
        for (var i = 0; i < players.length; i++) {
            gameArena.addNewPlayer(players[i]);
        }
    };

    raim.client.playerMoved = function (gameState) { gameArena && gameArena.playerMoved(gameState); }

    function signOff() {
        var player = gameArena.getCurrentPlayer();
        if (player) {
            updateHighestScore(player.Score);
        }

        raim.server.signOff(_playerId);
        $.connection.hub.stop();
    }

    function updateHighestScore(playerScore) {
        var highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
        localStorage.setItem("highestScore", Math.max(highestScore, playerScore));
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
                    if (!connected)
                        return;

                    gameArena.stop();

                    $.connection.hub.stop();
                    connected = false;
                    document.getElementById("registration").style.display = "block";

                    var arenaElement = document.getElementById("arena");
                    arenaElement.style.display = "none";

                    while (arenaElement.firstChild) {
                        arenaElement.removeChild(arenaElement.firstChild);
                    }

                    var playersList = document.getElementById("playersList");
                    while (playersList.firstChild) {
                        playersList.removeChild(playersList.firstChild);
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