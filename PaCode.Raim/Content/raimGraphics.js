var raimGraphics = function (args) {
    var canvas = args.canvas;
    var objects = args.objects;
    var drawingContext = canvas.getContext("2d");
    var viewport = args.viewport;

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

        drawingContext.fillStyle = "rgba(255, 0, 0, 0.7)";
        drawingContext.strokeT

        x = gameObject.Position.X - viewport.x;
        y = gameObject.Position.Y - viewport.y;
        drawingContext.arc(x, -y, gameObject.Size, 0, 2 * Math.PI);
        drawingContext.fill();

        drawingContext.closePath();

        drawingContext.beginPath();

        drawingContext.strokeStyle = "rgba(0, 255, 0, 1)";
        drawingContext.fillStyle = "rgba(0, 255, 0, 1)";

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
        drawingContext.fill();

        drawingContext.closePath();
    }

    var startRendering = function () {
        requestAnimationFrame(drawArena);
    };

    return {
        startRendering: startRendering
    };
};