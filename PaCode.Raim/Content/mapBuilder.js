var arena = document.getElementById("arena");
var ctx = arena.getContext("2d");

arena.addEventListener("mousedown", mouseDown);
arena.addEventListener("mouseup", mouseUp);
arena.addEventListener("mousemove", mouseMove);

var startPoint;
var endPoint;

var coordinates = [];
var selected;
var selectedOrigCoord;

function mouseDown(e) {
    var mouseCoordinates = getMouseCoordinates(e);
    selected = coordinates.reverse().find(function (c) {
        return mouseCoordinates.x > c.start.x &&
               mouseCoordinates.x < c.end.x &&
               mouseCoordinates.y > c.start.y &&
               mouseCoordinates.y < c.end.y;
    });

    if (selected)
        selectedOrigCoord = { start: { x: selected.start.x, y: selected.start.y }, end: { x: selected.end.x, y: selected.end.y } };
    startPoint = { x: mouseCoordinates.x, y: mouseCoordinates.y };
}

function mouseMove(e) {
    var mouseCoordinates = getMouseCoordinates(e);
    if (!selected && !!startPoint) {
        endPoint = { x: mouseCoordinates.x, y: mouseCoordinates.y };
    }

    if (selected) {
        var xDiff = mouseCoordinates.x - startPoint.x;
        var yDiff = mouseCoordinates.y - startPoint.y;
        selected.start.x = selectedOrigCoord.start.x + xDiff;
        selected.start.y = selectedOrigCoord.start.y + yDiff;
        selected.end.x   = selectedOrigCoord.end.x + xDiff;
        selected.end.y   = selectedOrigCoord.end.y + yDiff;
    }
}

function mouseUp(e) {
    if (selected) {
    } else if (startPoint && endPoint) {
        coordinates.push({ start: startPoint, end: endPoint });
    }

    selectedOrigCoord = null;
    selected = null;
    startPoint = null;
    endPoint = null;
}

function getMouseCoordinates(e) {
    var targetRect = arena.getBoundingClientRect();
    mouseCoordinates = { x: e.clientX - targetRect.left, y: e.clientY - targetRect.top };

    return mouseCoordinates;
}

function draw() {
    ctx.clearRect(0, 0, arena.width, arena.height);

    for (var i = 0; i < coordinates.length; i++) {
        var coord = coordinates[i];
        ctx.beginPath();
        ctx.rect(coord.start.x, coord.start.y, coord.end.x - coord.start.x, coord.end.y - coord.start.y);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.rect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);