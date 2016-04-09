﻿var raimGraphics = function (args) {
    var canvas = args.canvas;
    var objects = args.objects;
    var drawingContext = canvas.getContext("2d");
    var viewport = args.viewport;

    var drawArena = function () {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < objects.count() ; i++) {
            var gameObject = objects.get(i);
            drawObject(gameObject);
        }
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

        var directionVector = { X: gameObject.FacingDirection.X, Y: gameObject.FacingDirection.Y };
        var length = directionVector.X * directionVector.X + directionVector.Y * directionVector.Y;
        length = Math.sqrt(length);
        directionVector.X /= length;
        directionVector.Y /= length;

        x = gameObject.Position.X + directionVector.X * gameObject.Size / 2;
        y = gameObject.Position.Y + directionVector.Y * gameObject.Size / 2;
        x -= viewport.x;
        y -= viewport.y;
        drawingContext.moveTo(x, -y);

        x = gameObject.Position.X + directionVector.X * gameObject.Size;
        y = gameObject.Position.Y + directionVector.Y * gameObject.Size;
        x -= viewport.x;
        y -= viewport.y;
        drawingContext.lineTo(x, -y);
        drawingContext.stroke();
        drawingContext.fill();

        drawingContext.closePath();
    }

    return {
        drawArena: drawArena
    };
};