var raimGraphics = function (args) {
    var drawingContext = args.canvas().getContext("2d");
    var scale = 1;
    var canvas;

    var backgroundPattern = (function () {
        var patternCanvas = document.createElement("canvas");
        patternCanvas.width = 10;
        patternCanvas.height = 10;
        var patternContext = patternCanvas.getContext("2d");

        patternContext.beginPath();
        patternContext.arc(5, 5, 1, 0, 2 * Math.PI);
        patternContext.strokeStyle = "rgba(0,0,0,0.2)";
        patternContext.stroke();

        return drawingContext.createPattern(patternCanvas, "repeat");
    })();

    var drawArena = function (gameObjects) {
        canvas = args.canvas();
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
        drawingContext.rect(0, 0, canvas.width, canvas.height);
        drawingContext.fillStyle = backgroundPattern;
        drawingContext.fill();

        scale = args.scale();

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
        x = bullet.Position.X + args.viewport().x;
        y = bullet.Position.Y + args.viewport().y;

        drawingContext.arc(x * scale, -y * scale, bullet.Size * scale, 0, 2 * Math.PI);
        drawingContext.fill();
        drawingContext.stroke();
        drawingContext.closePath();
    }

    function drawPlayer(player) {
        var x, y;
        drawingContext.beginPath();

        drawingContext.fillStyle = player.Color || "rgba(255, 0, 0, 0.7)";
        drawingContext.strokeStyle = "rgba(255, 0, 0, 0.7)";

        x = player.Position.X + args.viewport().x;
        y = player.Position.Y + args.viewport().y;
        drawingContext.arc(x * scale, -y * scale, player.Size * scale, 0, 2 * Math.PI);
        drawingContext.fill();

        drawingContext.closePath();

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
        x += args.viewport().x;
        y += args.viewport().y;
        drawingContext.moveTo(x * scale, -y * scale);

        x = player.Position.X + directionVector.X * player.Size;
        y = player.Position.Y + directionVector.Y * player.Size;
        x += args.viewport().x;
        y += args.viewport().y;
        drawingContext.lineTo(x * scale, -y * scale);
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

        var x = points[0].X + args.viewport().x;
        var y = -(points[0].Y + args.viewport().y);
        drawingContext.moveTo(x * scale, y * scale);
        for (var i = 1; i < points.length; i++) {
            x = points[i].X + args.viewport().x;
            y = -(points[i].Y + args.viewport().y);
            drawingContext.lineTo(x * scale, y * scale);
        }

        x = points[0].X + args.viewport().x;
        y = -(points[0].Y + args.viewport().y);
        drawingContext.lineTo(x * scale, y * scale);

        drawingContext.strokeStyle = "rgba(0, 0, 0, 1)";
        drawingContext.fillStyle = "rgba(200, 200, 200, 1)";
        drawingContext.stroke();
        drawingContext.fill();
        drawingContext.closePath();
    }

    return {
        drawArena: drawArena
    };
};