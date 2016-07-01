if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]))
                return this[i];
        }
    }
}