var raimGraphics = function (args) {
    var canvas = args.canvas;
    var drawingContext = canvas.getContext("2d");

    var drawArena = function (gameObjects) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

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
        x = bullet.Position.X - args.viewport().x;
        y = bullet.Position.Y - args.viewport().y;

        drawingContext.arc(x, -y, bullet.Size, 0, 2 * Math.PI);
        drawingContext.fill();
        drawingContext.closePath();
    }

    function drawPlayer(player) {
        var x, y;
        drawingContext.beginPath();

        drawingContext.fillStyle = "rgba(255, 0, 0, 0.7)";
        drawingContext.strokeT

        x = player.Position.X - args.viewport().x;
        y = player.Position.Y - args.viewport().y;
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
        x -= args.viewport().x;
        y -= args.viewport().y;
        drawingContext.moveTo(x, -y);

        x = player.Position.X + directionVector.X * player.Size;
        y = player.Position.Y + directionVector.Y * player.Size;
        x -= args.viewport().x;
        y -= args.viewport().y;
        drawingContext.lineTo(x, -y);
        drawingContext.stroke();
        drawingContext.fill();

        drawingContext.closePath();
    }

    return {
        drawArena: drawArena
    };
};