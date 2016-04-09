function userInput(args) {
    var keys = [];
    var keysPressed = 0;
    var mouseCoordinates = { x: 0, y: 0 };

    var keyDown = function (e) {
        if (keys.indexOf(e.which) == -1)
            keys.push(e.which);

        notifyKeysChanged();
    };

    var keyUp = function (e) {
        keys.splice(keys.indexOf(e.which), 1);
        notifyKeysChanged();
    };

    function notifyKeysChanged() {
        keysPressed = buildDirectionKey();
        args.inputChanged({ direction: keysPressed, mouse: mouseCoordinates });
    }

    function buildDirectionKey() {
        var keyPressed = keys.reduce(function (prev, current) {
            if (current === 87 || current === 119 || current === 38)
                return prev | moveDirections.Up;

            if (current === 83 || current === 115 || current === 40)
                return prev | moveDirections.Down;

            if (current === 65 || current === 97 || current === 37)
                return prev | moveDirections.Left;

            if (current === 68 || current === 100 || current === 39)
                return prev | moveDirections.Right;
        }, 0);

        return keyPressed;
    }

    function mouseMove(e) {
        var targetRect = document.getElementById("arena").children[0].getBoundingClientRect();
        mouseCoordinates = { x: e.clientX - targetRect.left, y: e.clientY - targetRect.top };
        mouseCoordinates.x = mouseCoordinates.x - args.viewport.x;
        mouseCoordinates.y = -(mouseCoordinates.y - args.viewport.y)
        args.inputChanged({ direction: keysPressed, mouse: mouseCoordinates });
    }

    (function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        document.addEventListener("mousemove", mouseMove);
    })();

    return {
        keys: keysPressed,
        mouse: function () { return mouseCoordinates; }
    };
};