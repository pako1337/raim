var arena = document.getElementById("arena");
var objects = document.getElementById("objects");
var xSize = document.getElementById("x");
var ySize = document.getElementById("y");
var map = document.getElementById("map");
var ctx = arena.getContext("2d");

arena.addEventListener("mousedown", mouseDown);
arena.addEventListener("mouseup", mouseUp);
arena.addEventListener("mousemove", mouseMove);
arena.addEventListener("dblclick", mouseDoubleClick);

xSize.addEventListener("change", sizeChanged);
ySize.addEventListener("change", sizeChanged);

document.getElementById("applyMap").addEventListener("click", readMap);

function sizeChanged() {
    arena.width = parseInt(x.value);
    arena.height = parseInt(y.value);
    map.textContent = writeMap();
}

var startPoint;
var endPoint;

var coordinates = [];
var selected;
var selectedOrigCoord;

sizeChanged();

function mouseDown(e) {
    var mouseCoordinates = getMouseCoordinates(e);
    selected = getSelectedElement(mouseCoordinates);

    if (selected)
        selectedOrigCoord = { start: { x: selected.start.x, y: selected.start.y }, end: { x: selected.end.x, y: selected.end.y } };
    startPoint = { x: mouseCoordinates.x, y: mouseCoordinates.y };
}

function mouseDoubleClick(e) {
    var mouseCoordinates = getMouseCoordinates(e);
    var clickedElement = getSelectedElement(mouseCoordinates);
    if (!clickedElement) return;

    var elementIndex = coordinates.indexOf(clickedElement);
    removeCoordinates(elementIndex);
}

function getSelectedElement(mouseCoordinates) {
    return coordinates.find(function (c) {
        return mouseCoordinates.x > c.start.x &&
               mouseCoordinates.x < c.end.x &&
               mouseCoordinates.y > c.start.y &&
               mouseCoordinates.y < c.end.y;
    });
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
        selected.end.x = selectedOrigCoord.end.x + xDiff;
        selected.end.y = selectedOrigCoord.end.y + yDiff;
        printObjectsList();
    }
}

function mouseUp(e) {
    if (selected) {
    } else if (startPoint && endPoint) {
        var start = { x: Math.min(startPoint.x, endPoint.x), y: Math.min(startPoint.y, endPoint.y) };
        var end = { x: Math.max(startPoint.x, endPoint.x), y: Math.max(startPoint.y, endPoint.y) };
        coordinates.push({ start: start, end: end });
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

    ctx.beginPath();
    for (var i = 0; i < coordinates.length; i++) {
        var coord = coordinates[i];
        ctx.rect(coord.start.x, coord.start.y, coord.end.x - coord.start.x, coord.end.y - coord.start.y);
    }
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.fillStyle = "rgba(200, 200, 200, 1)";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

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

    map.value = writeMap();
}

function writeMap() {
    var map = "";

    map += arena.width + "," + arena.height;
    map += "\n";

    for (var i = 0; i < coordinates.length; i++) {
        var c = coordinates[i];

        map += c.start.x + ", " + (arena.height - c.start.y) + ", "
             + c.end.x + ", " + (arena.height - c.start.y) + ", "
             + c.end.x + ", " + (arena.height - c.end.y) + ", "
             + c.start.x + ", " + (arena.height - c.end.y);

        map += "\n";
    }

    return map;
}

function readMap() {
    coordinates = [];
    var lines = map.value.split("\n");
    var size = lines[0].split(",");

    width = parseInt(size[0]);
    height = parseInt(size[1]);

    xSize.value = width;
    ySize.value = height;
    sizeChanged();

    for (var i = 1; i < lines.length; i++) {
        var coords = lines[i].split(",");

        if (coords.length <= 1) continue;

        var start = { x: parseInt(coords[0]), y: height - parseInt(coords[1]) };
        var end = { x: parseInt(coords[4]), y: height - parseInt(coords[5]) };
        coordinates.push({ start, end });
    }

    printObjectsList();
}