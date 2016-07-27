var raimGraphics = function (args) {
    var drawingContext, backgroundContext;
    var scale = 1;
    var canvas, background;
    var originalSize = { x: 1600, y: 861 };
    var viewport;
    var box = { Top: 0, Right: 0, Bottom: 0, Left: 0, };

    var resizeCanvas = function () {
        var arenaElement = document.getElementById(args.arenaHandler);
        var widthRatio = arenaElement.offsetWidth / originalSize.x;
        var heightRatio = arenaElement.offsetHeight / originalSize.y;

        var aspectRatio = originalSize.x / originalSize.y;
        var w, h;
        if (widthRatio < heightRatio) {
            w = arenaElement.offsetWidth;
            h = w / aspectRatio;
        } else {
            h = arenaElement.offsetHeight;
            w = h * aspectRatio;
        }

        canvas.width = w;
        canvas.height = h;
        background.width = w;
        background.height = h;

        scale = canvas.width / originalSize.x;
    };

    (function () {
        background = document.createElement("canvas");
        document.getElementById(args.arenaHandler).appendChild(background);

        canvas = document.createElement("canvas");
        document.getElementById(args.arenaHandler).appendChild(canvas);
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);

        drawingContext = canvas.getContext("2d");
        backgroundContext = background.getContext("2d");
    })();

    var drawArena = function (gameObjects) {
        viewport = args.viewport();

        box.Top = -viewport.y;
        box.Left = -viewport.x;
        box.Bottom = -viewport.y - originalSize.y;
        box.Right = originalSize.x - viewport.x;

        drawBackground();
        drawGameObjects(gameObjects);
    };

    var count = 0;
    function drawGameObjects(gameObjects) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
        drawingContext.save();
        drawingContext.scale(scale, -scale);

        for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];
            if (isColliding(gameObject.BoundingBox, box)) {
                if (gameObject.Name === undefined) {
                    drawBullet(gameObject);
                } else {
                    drawPlayer(gameObject);
                }
            }
        }

        drawingContext.restore();
    }

    function drawBullet(bullet) {
        drawingContext.beginPath();

        var translateX = bullet.Position.X - bullet.Size + viewport.x;
        var translateY = bullet.Position.Y - bullet.Size + viewport.y;
        drawingContext.translate(translateX, translateY);

        drawingContext.rect(0, 0, bullet.Size * 2, bullet.Size * 2);
        drawingContext.fillStyle = bulletPattern;
        drawingContext.fill();

        drawingContext.translate(-translateX, -translateY);
        drawingContext.closePath();
    }

    function drawPlayer(player) {
        drawingContext.beginPath();

        var translateX = player.Position.X - player.Size + viewport.x;
        var translateY = player.Position.Y - player.Size + viewport.y;
        drawingContext.translate(translateX, translateY);

        drawingContext.rect(0, 0, player.Size * 2, player.Size * 2);
        drawingContext.fillStyle = playerPatterns[player.Style || 'orange'];
        drawingContext.fill();

        drawingContext.translate(-translateX, -translateY);

        drawingContext.closePath();
    }

    var prevScale = 0, prevViewportX = 0, prevViewportY = 0;
    function drawBackground() {
        if (prevScale === scale && prevViewportX === viewport.x && prevViewportY === viewport.y)
            return;

        backgroundContext.clearRect(0, 0, background.width, background.height);
        backgroundContext.save();
        backgroundContext.scale(scale, -scale);

        drawObstacles();

        backgroundContext.restore();

        prevScale = scale;
        prevViewportX = viewport.x;
        prevViewportY = viewport.y;
    }

    function drawObstacles() {
        if (args.arena() == undefined) return;

        var obstacles = args.arena().Obstacles;
        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (isColliding(obstacle.BoundingBox, box)) {
                backgroundContext.beginPath();

                drawPolygon(obstacle.Points, backgroundContext);

                backgroundContext.fillStyle = "rgba(200, 200, 200, 1)";
                backgroundContext.fill();
                backgroundContext.closePath();
            }
        }
    }

    function drawPolygon(points, context) {
        if (points.length < 2) return;

        moveTo(points[0].X, points[0].Y, context);
        for (var i = 1; i < points.length; i++) {
            lineTo(points[i].X, points[i].Y, context);
        }
    }

    function moveTo(x, y, context) {
        context.moveTo(applyXViewport(x), applyYViewport(y));
    }

    function lineTo(x, y, context) {
        context.lineTo(applyXViewport(x), applyYViewport(y));
    }

    function applyXViewport(x) {
        return Math.floor((x + viewport.x));
    }

    function applyYViewport(y) {
        return Math.floor((y + viewport.y));
    }

    var playerPatternBuilder = function (fillStyle, strokeStyle) {
        var canvasPattern = document.createElement("canvas");
        canvasPattern.width = 40;
        canvasPattern.height = 40;
        var context = canvasPattern.getContext("2d");

        context.beginPath();

        context.arc(20, 20, 19, 0, 2 * Math.PI);

        context.fillStyle = fillStyle;
        context.strokeStyle = strokeStyle;
        context.fill();
        context.stroke();

        context.closePath();

        return drawingContext.createPattern(canvasPattern, "repeat");
    };

    var playerPatterns = (function () {
        var playerStyles = [
            { name: "orange", style: "rgba(245,85,26,1)" },
            { name: "green", style: "rgba(125,188,57,1)" },
            { name: "blue", style: "rgba(7,92,191,1)" },
            { name: "darkyellow", style: "rgba(174,173,58,1)" },
            { name: "aqua", style: "rgba(54,201,240,1)" }
        ];

        patterns = {};
        for (var i = 0; i < playerStyles.length; i++) {
            var playerStyle = playerStyles[i];
            patterns[playerStyle.name] = playerPatternBuilder(playerStyle.style, playerStyle.style);
        }

        return patterns;
    })();

    var bulletPattern = (function () {
        var canvasPattern = document.createElement("canvas");
        canvasPattern.width = 4;
        canvasPattern.height = 4;
        var context = canvasPattern.getContext("2d");

        context.beginPath();

        context.arc(2, 2, 2, 0, 2 * Math.PI);

        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.fill();

        context.closePath();

        return drawingContext.createPattern(canvasPattern, "repeat");
    })();

    return {
        drawArena: drawArena,
        originalSize: originalSize,
        scale: function () { return scale; },
        resizeCanvas: resizeCanvas
    };
};