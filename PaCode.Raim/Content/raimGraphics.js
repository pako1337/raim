﻿var raimGraphics = function (args) {
    var canvas = args.canvas;
    var drawingContext = canvas.getContext("2d");

    var drawArena = function (gameObjects) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        drawArenaBorders();
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

        drawingContext.fillStyle = "rgba(0, 0, 0, 1)";
        x = bullet.Position.X + args.viewport().x;
        y = bullet.Position.Y + args.viewport().y;

        drawingContext.arc(x, -y, bullet.Size, 0, 2 * Math.PI);
        drawingContext.fill();
        drawingContext.closePath();
    }

    function drawPlayer(player) {
        var x, y;
        drawingContext.beginPath();

        drawingContext.fillStyle = "rgba(255, 0, 0, 0.7)";
        drawingContext.strokeStyle = "rgba(255, 0, 0, 0.7)";

        x = player.Position.X + args.viewport().x;
        y = player.Position.Y + args.viewport().y;
        drawingContext.arc(x, -y, player.Size, 0, 2 * Math.PI);
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
        drawingContext.moveTo(x, -y);

        x = player.Position.X + directionVector.X * player.Size;
        y = player.Position.Y + directionVector.Y * player.Size;
        x += args.viewport().x;
        y += args.viewport().y;
        drawingContext.lineTo(x, -y);
        drawingContext.stroke();
        drawingContext.fill();

        drawingContext.closePath();
    }

    function drawArenaBorders() {
        if (args.arena() == undefined) return;

        drawRectangle([
            { X: 0, Y: 0 },
            { X: 0, Y: args.arena().ArenaSize.Y },
            { X: args.arena().ArenaSize.X, Y: args.arena().ArenaSize.Y },
            { X: args.arena().ArenaSize.X, Y: 0 }]);
    }

    function drawObstacles() {
        if (args.arena() == undefined) return;

        var obstacles = args.arena().Obstacles;
        for (var i = 0; i < obstacles.length; i++) {
            drawRectangle(obstacles[i].Points);
        }
    }

    function drawRectangle(points) {
        if (points.length < 2) return;

        drawingContext.beginPath();

        drawingContext.moveTo(points[0].X + args.viewport().x, -(points[0].Y + args.viewport().y));
        for (var i = 1; i < points.length; i++) {
            drawingContext.lineTo(points[i].X + args.viewport().x, -(points[i].Y + args.viewport().y));
        }

        drawingContext.lineTo(points[0].X + args.viewport().x, -(points[0].Y + args.viewport().y));

        drawingContext.strokeStyle = "rgba(0, 0, 0, 1)";
        drawingContext.stroke();
        drawingContext.closePath();
    }

    return {
        drawArena: drawArena
    };
};