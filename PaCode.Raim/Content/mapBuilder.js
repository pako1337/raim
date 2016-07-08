var arena = document.getElementById("arena");
var objects = document.getElementById("objects");
var xSize = document.getElementById("x");
var ySize = document.getElementById("y");
var ctx = arena.getContext("2d");

arena.addEventListener("mousedown", mouseDown);
arena.addEventListener("mouseup", mouseUp);
arena.addEventListener("mousemove", mouseMove);

xSize.addEventListener("change", sizeChanged);
ySize.addEventListener("change", sizeChanged);

function sizeChanged() {
    arena.width = parseInt(x.value);
    arena.height = parseInt(y.value);
}

var startPoint;
var endPoint;

var coordinates = [];
var selected;
var selectedOrigCoord;

function mouseDown(e) {
    var mouseCoordinates = getMouseCoordinates(e);
    console.log(mouseCoordinates);
    selected = coordinates.find(function (c) {
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
        var xDiff = Math.floor(mouseCoordinates.x - startPoint.x);
        var yDiff = Math.floor(mouseCoordinates.y - startPoint.y);
        selected.start.x = selectedOrigCoord.start.x + xDiff;
        selected.start.y = selectedOrigCoord.start.y + yDiff;
        selected.end.x   = selectedOrigCoord.end.x + xDiff;
        selected.end.y   = selectedOrigCoord.end.y + yDiff;
        printObjectsList();
    }
}

function mouseUp(e) {
    if (selected) {
    } else if (startPoint && endPoint) {
        coordinates.push({ start: startPoint, end: endPoint });
        printObjectsList();
    }

    selectedOrigCoord = null;
    selected = null;
    startPoint = null;
    endPoint = null;
}

function getMouseCoordinates(e) {
    var targetRect = arena.getBoundingClientRect();
    mouseCoordinates = { x: Math.floor(e.clientX - targetRect.left), y: Math.floor(e.clientY - targetRect.top) };

    return mouseCoordinates;
}

function draw() {
    ctx.clearRect(0, 0, arena.width, arena.height);

    for (var i = 0; i < coordinates.length; i++) {
        var coord = coordinates[i];
        ctx.beginPath();
        ctx.rect(coord.start.x, coord.start.y, coord.end.x - coord.start.x, coord.end.y - coord.start.y);
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    if (!selected && startPoint && endPoint) {
        ctx.beginPath();
        ctx.rect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(draw);
}

function removeCoordinates(index) {
    coordinates.splice(index, 1);
    printObjectsList();
}

requestAnimationFrame(draw);

function printObjectsList() {
    while (objects.firstChild) {
        objects.removeChild(objects.firstChild);
    }

    for (var i = 0; i < coordinates.length; i++) {
        var c = coordinates[i];
        var li = document.createElement("li");
        li.innerHTML = "" + c.start.x + ", " + c.start.y + ", " + c.end.x + ", " + c.end.y;
        li.setAttribute("data-index", i);
        li.onclick = function () {
            removeCoordinates(this.getAttribute("data-index"));
        }
        objects.appendChild(li);
    }
}

function writeMap() {
    var map = "";

    map += arena.width + "," + arena.height;
    map += "\n";

    for (var i = 0; i < coordinates.length; i++) {
        var c = coordinates[i];
        
        var x = Math.min(c.start.x, c.end.x);
        var y = Math.min(c.start.y, c.end.y);
        var width = Math.abs(c.end.x - c.start.x);
        var heigh = Math.abs(c.end.y - c.start.y);

        map += x + ", " + y + ", " + x + ", " + (y + heigh) + ", " + (x + width) + ", " + (y + heigh) + ", " + (x + width) + ", " + y;

        map += "\n\n";
    }

    return map;
}