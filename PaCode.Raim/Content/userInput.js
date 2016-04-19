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
        var newKeys = buildDirectionKey();

        keysPressed = newKeys;
        args.inputChanged({ direction: keysPressed, mouse: mouseCoordinates });
    }

    function buildDirectionKey() {
        var keyPressed = keys.reduce(function (prev, current) {
            if (current === 87 || current === 119 || current === 38)
                return prev | keysInput.Up;

            if (current === 83 || current === 115 || current === 40)
                return prev | keysInput.Down;

            if (current === 65 || current === 97 || current === 37)
                return prev | keysInput.Left;

            if (current === 68 || current === 100 || current === 39)
                return prev | keysInput.Right;

            if (current === 1)
                return prev | keysInput.MouseLeft;
        }, 0);

        return keyPressed;
    }

    function mouseMove(e) {
        var targetRect = document.getElementById("arena").children[0].getBoundingClientRect();
        mouseCoordinates = { x: e.clientX - targetRect.left, y: e.clientY - targetRect.top };
        mouseCoordinates.x = mouseCoordinates.x - args.viewport.x;
        mouseCoordinates.y = -(mouseCoordinates.y - args.viewport.y);

        notifyKeysChanged();
    }

    function mouseDown(e) {
        if ((e.buttons && 1) && (keys.indexOf(1) === -1)) {
            keys.push(1);
        }
        notifyKeysChanged();
    }

    function mouseUp(e) {
        if (keys.indexOf(1) >= 0) {
            keys.splice(keys.indexOf(1), 1);
        }
        notifyKeysChanged();
    }

    (function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
    })();

    return {
        keys: keysPressed,
        mouse: function () { return mouseCoordinates; }
    };
};