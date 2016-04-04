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
        var keyPressed = 0;
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k === 87 || k === 119 || k === 38)
                keyPressed |= moveDirections.Up;

            if (k === 83 || k === 115 || k === 40)
                keyPressed |= moveDirections.Down;

            if (k === 65 || k === 97 || k === 37)
                keyPressed |= moveDirections.Left;

            if (k === 68 || k === 100 || k === 39)
                keyPressed |= moveDirections.Right;
        }

        return keyPressed;
    }

    (function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
    })();
};