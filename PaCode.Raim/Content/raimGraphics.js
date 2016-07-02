var raimGraphics = function (args) {
    var drawingContext = args.canvas().getContext("2d");
    var scale = 1;
    var canvas;

    var patternSize = { x: 30, y: 30 };
    var backgroundPattern = (function () {
        var patternCanvas = document.createElement("canvas");
        patternCanvas.width  = patternSize.x;
        patternCanvas.height = patternSize.y;
        var patternContext = patternCanvas.getContext("2d");

        patternContext.beginPath();
        patternContext.moveTo(patternSize.x, 0);
        patternContext.lineTo(0, 0);
        patternContext.lineTo(patternSize.x / 2, patternSize.y);
        patternContext.moveTo(patternSize.x, patternSize.y);
        patternContext.lineTo(0, patternSize.y);
        patternContext.strokeStyle = "rgba(0,0,0,0.15)";
        patternContext.stroke();

        return drawingContext.createPattern(patternCanvas, "repeat");
    })();

    var playerPattern = (function () {
        var canvasPattern = document.createElement("canvas");
        canvasPattern.width = 40;
        canvasPattern.height = 40;
        var context = canvasPattern.getContext("2d");

        context.beginPath();

        context.arc(20, 20, 20, 0, 2 * Math.PI);

        context.fillStyle = "rgba(255, 0, 0, 1)";
        context.strokeStyle = "rgba(255, 255, 0, 1)";
        context.fill();
        context.stroke();

        context.closePath();

        return drawingContext.createPattern(canvasPattern, "repeat");
    })();

    var drawArena = function (gameObjects) {
        canvas = args.canvas();

        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
        scale = args.scale();
        
        var backgroundX = Math.round(args.viewport().x % patternSize.x) * scale;
        var backgroundY = Math.round(args.viewport().y % patternSize.y) * scale;
        drawingContext.save();
        drawingContext.translate(backgroundX, -backgroundY);
        drawingContext.rect(0, 0, canvas.width, canvas.height);
        drawingContext.fillStyle = backgroundPattern;
        drawingContext.scale(scale, scale);
        drawingContext.fill();
        drawingContext.restore();

        drawObstacles();

        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];
            if (gameObject.Name === undefined) {
                drawBullet(gameObject);
            } else {
                drawPlayer(gameObject);
            }
        }
    };

    function drawBullet(bullet) {
        drawingContext.beginPath();

        drawingContext.strokeStyle = "rgba(0, 0, 0, 1)"
        drawingContext.fillStyle = bullet.Color || "rgba(0, 0, 0, 1)";

        circle(bullet.Position.X, bullet.Position.Y, bullet.Size);
        drawingContext.fill();
        drawingContext.stroke();
        drawingContext.closePath();
    }

    function drawPlayer(player) {
        var x, y;

        drawingContext.save();
        drawingContext.beginPath();

        drawingContext.translate( (player.Position.X - player.Size + args.viewport().x) * scale,
                                 -(player.Position.Y - player.Size + args.viewport().y) * scale);
        drawingContext.scale(scale, -scale);

        drawingContext.rect(0, 0, player.Size * 2, player.Size * 2);


        drawingContext.fillStyle = playerPattern;
        drawingContext.fill();

        drawingContext.closePath();
        drawingContext.restore();


        drawingContext.beginPath();

        drawingContext.strokeStyle = "rgba(0, 255, 0, 1)";
        drawingContext.fillStyle = "rgba(0, 255, 0, 1)";

        var directionVector = { X: player.FacingDirection.X, Y: player.FacingDirection.Y };
        var length = directionVector.X * directionVector.X + directionVector.Y * directionVector.Y;
        length = Math.sqrt(length);
        directionVector.X /= length;
        directionVector.Y /= length;

        x = player.Position.X + directionVector.X * player.Size / 2;
        y = player.Position.Y + directionVector.Y * player.Size / 2;
        moveTo(x, y);

        x = player.Position.X + directionVector.X * player.Size;
        y = player.Position.Y + directionVector.Y * player.Size;
        lineTo(x, y);
        drawingContext.stroke();
        drawingContext.fill();

        drawingContext.closePath();
    }

    function drawObstacles() {
        if (args.arena() == undefined) return;

        var obstacles = args.arena().Obstacles;
        for (var i = 0; i < obstacles.length; i++) {
            drawPolygon(obstacles[i].Points);
        }
    }

    function drawPolygon(points) {
        if (points.length < 2) return;

        drawingContext.beginPath();

        moveTo(points[0].X, points[0].Y);
        for (var i = 1; i < points.length; i++) {
            lineTo(points[i].X, points[i].Y);
        }

        lineTo(points[0].X, points[0].Y);

        drawingContext.strokeStyle = "rgba(0, 0, 0, 1)";
        drawingContext.fillStyle = "rgba(200, 200, 200, 1)";
        drawingContext.stroke();
        drawingContext.fill();
        drawingContext.closePath();
    }

    function moveTo(x, y) {
        var coord = applyViewportAndScale(x, y);

        drawingContext.moveTo(coord.x, coord.y);
    }

    function lineTo(x, y) {
        var coord = applyViewportAndScale(x, y);

        drawingContext.lineTo(coord.x, coord.y);
    }

    function circle(x, y, r) {
        var coord = applyViewportAndScale(x, y);

        drawingContext.arc(coord.x, coord.y, r * scale, 0, Math.PI * 2);
    }

    function applyViewportAndScale(x, y) {
        x = x + args.viewport().x;
        y = -(y + args.viewport().y);

        x *= scale;
        y *= scale;

        return {
            x: Math.floor(x),
            y: Math.floor(y)
        };
    }

    return {
        drawArena: drawArena
    };
};