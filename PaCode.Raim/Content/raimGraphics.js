var raimGraphics = function (args) {
    var canvas = args.canvas;
    var objects = args.objects;
    var drawingContext = canvas.getContext("2d");
    
    var drawArena = function () {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < objects.count() ; i++) {
            var gameObject = objects.get(i);

            drawingContext.beginPath();
            drawingContext.strokeStyle = "#F00";
            drawingContext.fillStyle = "#F00";
            drawingContext.arc(gameObject.Position.X, gameObject.Position.Y, gameObject.Size, 0, 2 * Math.PI);
            drawingContext.stroke();
            drawingContext.fill();
            drawingContext.closePath();
        }

        requestAnimationFrame(drawArena);
    };

    return {
        startRendering: drawArena
    };
};