if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]))
                return this[i];
        }
    }
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]))
                return i;
        }
    }
}

var isColliding = function (a, b) {
    return !(a.Right < b.Left &&
             a.Left > b.Right &&
             a.Bottom > b.Top &&
             a.Top < b.Bottom);
};