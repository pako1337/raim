var raimGraphics = function (args) {
    var drawingContext, backgroundContext;
    var scale = 1;
    var canvas, background;
    var originalSize = { x: 1600, y: 861 };

    var resizeCanvas = function () {
        var arenaElement = document.getElementById(args.arenaHandler);
        var widthDiff = originalSize.x - arenaElement.offsetWidth;
        var heightDiff = originalSize.y - arenaElement.offsetHeight;

        var aspectRatio = originalSize.x / originalSize.y;
        var w, h;

        if (Math.abs(widthDiff) > Math.abs(heightDiff)) {
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
            {name: "orange", style: "rgba(245,85,26,1)" },
            {name: "green", style: "rgba(125,188,57,1)"},
            {name: "blue", style: "rgba(7,92,191,1)"  },
            {name: "darkyellow", style: "rgba(174,173,58,1)"},
            {name: "aqua", style: "rgba(54,201,240,1)" }
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

    var drawArena = function (gameObjects) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBackground();

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
        drawingContext.save();
        drawingContext.beginPath();

        drawingContext.translate( (bullet.Position.X - bullet.Size + args.viewport().x) * scale,
                                 -(bullet.Position.Y - bullet.Size + args.viewport().y) * scale);
        drawingContext.scale(scale, -scale);

        drawingContext.rect(0, 0, bullet.Size * 2, bullet.Size * 2);

        drawingContext.fillStyle = bulletPattern;
        drawingContext.fill();
        drawingContext.closePath();
        drawingContext.restore();
    }

    function drawPlayer(player) {
        drawingContext.save();
        drawingContext.beginPath();

        drawingContext.translate( (player.Position.X - player.Size + args.viewport().x) * scale,
                                 -(player.Position.Y - player.Size + args.viewport().y) * scale);
        drawingContext.scale(scale, -scale);

        drawingContext.rect(0, 0, player.Size * 2, player.Size * 2);

        drawingContext.fillStyle = playerPatterns[player.Style || 'orange'];
        drawingContext.fill();

        drawingContext.closePath();
        drawingContext.restore();
    }

    var backgroundTileSize = { x: 30, y: 30 };
    var backgroundPattern = (function () {
        var patternCanvas = document.createElement("canvas");
        patternCanvas.width = backgroundTileSize.x;
        patternCanvas.height = backgroundTileSize.y;
        var patternContext = patternCanvas.getContext("2d");

        patternContext.beginPath();
        patternContext.moveTo(backgroundTileSize.x, 0);
        patternContext.lineTo(0, 0);
        patternContext.lineTo(backgroundTileSize.x / 2, backgroundTileSize.y);
        patternContext.moveTo(backgroundTileSize.x, backgroundTileSize.y);
        patternContext.lineTo(0, backgroundTileSize.y);
        patternContext.strokeStyle = "rgba(0,0,0,0.15)";
        patternContext.stroke();

        return drawingContext.createPattern(patternCanvas, "repeat");
    })();

    var prevScale = 0, prevViewportX = 0, prevViewportY = 0;
    function drawBackground() {
        if (prevScale === scale && prevViewportX === args.viewport().x && prevViewportY === args.viewport().y)
            return;

        backgroundContext.clearRect(0, 0, background.width, background.height);

        var backgroundX = Math.round(args.viewport().x % backgroundTileSize.x) * scale;
        var backgroundY = Math.round(args.viewport().y % backgroundTileSize.y) * scale;

        backgroundContext.save();
        backgroundContext.translate(backgroundX, -backgroundY);
        backgroundContext.rect(backgroundX, backgroundY, background.width, background.height);
        backgroundContext.fillStyle = backgroundPattern;
        backgroundContext.scale(scale, scale);
        backgroundContext.fill();
        backgroundContext.restore();

        drawObstacles();

        prevScale = scale;
        prevViewportX = args.viewport().x;
        prevViewportY = args.viewport().y;
    }

    function drawObstacles() {
        if (args.arena() == undefined) return;

        var obstacles = args.arena().Obstacles;
        for (var i = 0; i < obstacles.length; i++) {
            drawPolygon(obstacles[i].Points, backgroundContext);
        }
    }

    function drawPolygon(points, context) {
        if (points.length < 2) return;

        context.beginPath();

        moveTo(points[0].X, points[0].Y, context);
        for (var i = 1; i < points.length; i++) {
            lineTo(points[i].X, points[i].Y, context);
        }

        lineTo(points[0].X, points[0].Y, context);

        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.fillStyle = "rgba(200, 200, 200, 1)";
        context.stroke();
        context.fill();
        context.closePath();
    }

    function moveTo(x, y, context) {
        var coord = applyViewportAndScale(x, y);

        context.moveTo(coord.x, coord.y);
    }

    function lineTo(x, y, context) {
        var coord = applyViewportAndScale(x, y);

        context.lineTo(coord.x, coord.y);
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
        drawArena: drawArena,
        originalSize: originalSize,
        scale: function () { return scale; },
        resizeCanvas: resizeCanvas
    };
};