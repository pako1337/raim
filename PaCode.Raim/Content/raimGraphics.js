var raimGraphics = function (args) {
    var canvas = args.canvas;
    var objects = args.objects;
    var drawingContext = canvas.getContext("2d");
    var viewport = { x: 0, y: canvas.height };

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
            drawObject(gameObject);
        }

        lastFrameTime = timestamp;
        requestAnimationFrame(drawArena);
    };

    function drawObject(gameObject) {
        var x, y;
        drawingContext.beginPath();

        drawingContext.strokeStyle = "#F00";
        drawingContext.fillStyle = "#F00";

        x = gameObject.Position.X - viewport.x;
        y = gameObject.Position.Y - viewport.y;
        drawingContext.arc(x, -y, gameObject.Size, 0, 2 * Math.PI);
        drawingContext.stroke();
        drawingContext.fill();

        drawingContext.closePath();

        drawingContext.beginPath();

        drawingContext.strokeStyle = "#0F0";

        x = gameObject.Position.X + gameObject.FacingDirection.X * gameObject.Size / 2;
        y = gameObject.Position.Y + gameObject.FacingDirection.Y * gameObject.Size / 2;
        x -= viewport.x;
        y -= viewport.y;
        drawingContext.moveTo(x, -y);

        x = gameObject.Position.X + gameObject.FacingDirection.X * gameObject.Size;
        y = gameObject.Position.Y + gameObject.FacingDirection.Y * gameObject.Size;
        x -= viewport.x;
        y -= viewport.y;
        drawingContext.lineTo(x, -y);
        drawingContext.stroke();
    }

    var startRendering = function () {
        requestAnimationFrame(drawArena);
    };

    return {
        startRendering: startRendering,
        viewport: viewport
    };
};