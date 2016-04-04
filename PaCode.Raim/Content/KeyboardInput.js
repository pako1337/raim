function keyboardInput(args) {
    var keys = [];

    var keyDown = function (e) {
        if (keys.indexOf(e.which) == -1)
            keys.push(e.which);

        args.inputChanged({ direction: buildDirectionKey() });
    };


    var keyUp = function (e) {
        keys.splice(keys.indexOf(e.which), 1);

        args.inputChanged({ direction: buildDirectionKey() });
    };

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

    (function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
    })();
};