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
        var mouse = { x: mouseCoordinates.x, y: mouseCoordinates.y };

        args.inputChanged({ direction: keysPressed, mouse: mouse });
    }

    function buildDirectionKey() {
        var keyPressed = keys.reduce(function (prev, current) {
            if (current === 87 || current === 119 || current === 38 || current === 3)
                return prev | keysInput.Up;

            if (current === 83 || current === 115 || current === 40 || current === 2)
                return prev | keysInput.Down;

            if (current === 65 || current === 97 || current === 37 || current === 5)
                return prev | keysInput.Left;

            if (current === 68 || current === 100 || current === 39 || current === 4)
                return prev | keysInput.Right;

            if (current === 1)
                return prev | keysInput.MouseLeft;
        }, 0);

        return keyPressed;
    }

    function mouseMove(e) {
        var targetRect = document.getElementById("arena").children[0].getBoundingClientRect();
        mouseCoordinates = { x: e.clientX - targetRect.left, y: e.clientY - targetRect.top };

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

    var mainTouch = null;
    function touchStart(e) {
        if (mainTouch) return;

        e.preventDefault();
        var touch = e.changedTouches[0];
        mainTouch = copyTouch(touch);
    }

    function touchEnd(e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (mainTouch && mainTouch.identifier === touch.identifier) {
                e.preventDefault();
                mainTouch = null;
                keys.splice(keys.indexOf(2));
                keys.splice(keys.indexOf(3));
                keys.splice(keys.indexOf(4));
                keys.splice(keys.indexOf(5));
                notifyKeysChanged();
                return;
            }
        }
    }

    function touchCancel(e) {
        touchEnd(e);
    }

    function touchMove(e) {
        if (!mainTouch) return;

        e.preventDefault();
        var ongoingTouch = null;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var t = e.changedTouches[i];
            if (mainTouch.identifier === t.identifier) {
                ongoingTouch = t;
                break;
            }
        }

        keys.splice(keys.indexOf(2));
        keys.splice(keys.indexOf(3));
        keys.splice(keys.indexOf(4));
        keys.splice(keys.indexOf(5));

        if (ongoingTouch.pageY > mainTouch.pageY + 10) {
            keys.push(2);
        }
        if (ongoingTouch.pageY < mainTouch.pageY - 10) {
            keys.push(3);
        }
        if (ongoingTouch.pageX > mainTouch.pageX + 10) {
            keys.push(4);
        }
        if (ongoingTouch.pageX < mainTouch.pageX - 10) {
            keys.push(5);
        }
        notifyKeysChanged();
    }

    function copyTouch(touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }

    var startListening = function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
        document.addEventListener("touchstart", touchStart);
        document.addEventListener("touchend", touchEnd);
        document.addEventListener("touchcancel", touchCancel);
        document.addEventListener("touchmove", touchMove);
    };

    var stopListening = function () {
        document.removeEventListener("keydown", keyDown);
        document.removeEventListener("keyup", keyUp);
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mousedown", mouseDown);
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("touchstart", touchStart);
        document.removeEventListener("touchend", touchEnd);
        document.removeEventListener("touchcancel", touchCancel);
        document.removeEventListener("touchmove", touchMove);
    }

    return {
        keys: keysPressed,
        mouse: function () { return mouseCoordinates; },
        startListening: startListening,
        stopListening: stopListening
    };
};