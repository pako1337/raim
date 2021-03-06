﻿(function () {
    var raim = $.connection.raimHub;
    var connected = false;

    var gameArena;
    var _playerId;

    function updateHighestScore(playerScore) {
        var highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
        localStorage.setItem("highestScore", Math.max(highestScore, playerScore));
    }

    var playerName = document.getElementById("playerName");
    var playButton = document.getElementById("playButton");
    var score = document.getElementById("score");

    playerName.addEventListener("keyup", function () {
        if (event.keyCode == 13) playButton.click();
    });
    playerName.value = localStorage.getItem("playerName");

    function printHighestScore() {
        score.innerText = localStorage.getItem("highestScore") || 0;
    }

    printHighestScore();

    raim.client.signedIn = function (id) {
        connected = true;
        _playerId = id;
        gameArena.setPlayer(id);
    };

    raim.client.setupArena = function (arenaData) {
        gameArena.setupArena(arenaData);
    };

    raim.client.signedOff = function (player) {
        if (player.Id == _playerId) {
            updateHighestScore(player.Score)
        }
    };

    raim.client.playerMoved = function (gameState) { gameArena && gameArena.playerMoved(gameState); }

    playButton.addEventListener("click", function () {

        playButton.setAttribute("disabled", true);
        setTimeout(function () {
            playButton.removeAttribute("disabled");
        }, 1000);

        $.connection.hub.start().done(function () {

            document.getElementById("registration").style.display = "none";
            var arenaElement = document.getElementById("arena").style.display = "block";

            gameArena = new arena({
                playerMoving: function (e) {
                    if (!connected) return;

                    raim.server.playerMoving(e);
                },
                signOut: function (player) {
                    if (!connected)
                        return;

                    player = player || { Score: 0 };
                    updateHighestScore(player.Score);

                    gameArena.stop();

                    $.connection.hub.stop();
                    connected = false;
                    document.getElementById("registration").style.display = "block";
                    printHighestScore();

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

            window.addEventListener("beforeunload", function () {
                var player = gameArena.getCurrentPlayer();
                if (player) {
                    updateHighestScore(player.Score);
                }

                raim.server.signOff(_playerId);
                $.connection.hub.stop();
            });
        });
    });
})();