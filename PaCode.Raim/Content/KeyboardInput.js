function keyboardInput(args) {
    var keyPressed = 0;

    var keyDown = function (e) {
        if (e.which === 87 || e.which === 119 || e.which === 38)
            keyPressed |= moveDirections.Up;

        if (e.which === 83 || e.which === 115 || e.which === 40)
            keyPressed |= moveDirections.Down;

        if (e.which === 65 || e.which === 97 || e.which === 37)
            keyPressed |= moveDirections.Left;

        if (e.which === 68 || e.which === 100 || e.which === 39)
            keyPressed |= moveDirections.Right;

        if (keyPressed > 0)
            args.inputChanged({ direction: keyPressed });
    };


    var keyUp = function (e) {
        var key = keyPressed;
        if (e.which === 87 || e.which === 119 || e.which === 38)
            keyPressed ^= moveDirections.Up;

        if (e.which === 83 || e.which === 115 || e.which === 40)
            keyPressed ^= moveDirections.Down;

        if (e.which === 65 || e.which === 97 || e.which === 37)
            keyPressed ^= moveDirections.Left;

        if (e.which === 68 || e.which === 100 || e.which === 39)
            keyPressed ^= moveDirections.Right;

        if (keyPressed !== key)
            args.inputChanged({ direction: keyPressed });
    };

    (function () {
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
    })();
};