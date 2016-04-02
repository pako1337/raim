var raimGraphics = function (args) {
    var canvas = args.canvas;
    var drawingContext = canvas.getContext("2d");

    var drawArena = function (players) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < players.count() ; i++) {
            var player = players.get(i);

            drawingContext.beginPath();
            drawingContext.strokeStyle = "#F00";
            drawingContext.fillStyle = "#F00";
            drawingContext.arc(player.Position.X, player.Position.Y, player.Size, 0, 2 * Math.PI);
            drawingContext.stroke();
            drawingContext.fill();
            drawingContext.closePath();
        }
    };

    return {
        drawArena: drawArena
    };
};