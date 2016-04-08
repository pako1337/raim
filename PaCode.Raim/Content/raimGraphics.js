var raimGraphics = function (args) {
    var canvas = args.canvas;
    var objects = args.objects;
    var drawingContext = canvas.getContext("2d");

    var lastFrameTime;
    
    var drawArena = function (timestamp) {
        if (!lastFrameTime)
            lastFrameTime = timestamp;

        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        var timeDiff = (timestamp - lastFrameTime) / 1000;

        for (var i = 0; i < objects.count() ; i++) {
            var gameObject = objects.get(i);

            gameObject.Position.X += gameObject.Speed.X * timeDiff;
            gameObject.Position.Y += gameObject.Speed.Y * timeDiff;

            drawingContext.beginPath();

            drawingContext.strokeStyle = "#F00";
            drawingContext.fillStyle = "#F00";
            drawingContext.arc(gameObject.Position.X, gameObject.Position.Y, gameObject.Size, 0, 2 * Math.PI);
            drawingContext.stroke();
            drawingContext.fill();

            drawingContext.closePath();

            drawingContext.beginPath();

            drawingContext.strokeStyle = "#0F0";
            
            var x = gameObject.Position.X + gameObject.FacingDirection.X * gameObject.Size / 2;
            var y = gameObject.Position.Y + gameObject.FacingDirection.Y * gameObject.Size / 2;
            drawingContext.moveTo(x, y);

            x = gameObject.Position.X + gameObject.FacingDirection.X * gameObject.Size;
            y = gameObject.Position.Y + gameObject.FacingDirection.Y * gameObject.Size;
            drawingContext.lineTo(x, y);
            drawingContext.stroke();

        }

        lastFrameTime = timestamp;
        requestAnimationFrame(drawArena);
    };

    var startRendering = function () {
        requestAnimationFrame(drawArena);
    };

    return {
        startRendering: startRendering,
    };
};