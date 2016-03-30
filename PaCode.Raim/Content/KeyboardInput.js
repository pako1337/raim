function keyboardInput(args) {
    var keyDown = function (e) {
        var key = 0;
        if (e.which === 87 || e.which === 119 || e.which === 38)
            key |= moveDirections.Up;

        if (e.which === 83 || e.which === 115 || e.which === 40)
            key |= moveDirections.Down;

        if (e.which === 65 || e.which === 97 || e.which === 37)
            key |= moveDirections.Left;

        if (e.which === 68 || e.which === 100 || e.which === 39)
            key |= moveDirections.Right;

        if (key > 0)
            args.inputChanged({ direction: key });
    };

    (function () {
        document.addEventListener("keydown", keyDown);
    })();
};