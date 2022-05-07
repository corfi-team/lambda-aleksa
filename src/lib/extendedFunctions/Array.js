Array.prototype.clear = function (arr) {
    if (!arr) return false;
    let y = [];
    for (let e of arr) if (!!e) y.push(e);
    return y;
};
Array.prototype.deleteOne = function (x) {
    const arr = this;
    if (!arr) return false;
    if (!x) return arr;
    for (const i in arr) if (arr[i] === x) {
        arr.splice(i, 1);
        return arr;
    }
    return arr;
};
Array.prototype.shuffle = function () {
    const arr = this;
    const num = arr.length;
    let y = [];
    for (let i = 0; i < num; i++) y[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return y;
};
Array.prototype.positionOf = function (x) {
    const arr = this;
    if (!arr) return false;
    if (!arr) return false;
    for (let i in arr) if (!!arr[i] && arr[i] === x) return Number(i);
    return false;
};
Array.prototype.last = function () {
    const arr = this;
    return arr[arr.length - 1] || false;
};
Array.prototype.first = function () {
    const arr = this;
    return arr[0] || false;
};
Array.prototype.chunk = function (chunkSize) {
    const r = [];
    for (let i = 0; i < this.length; i += chunkSize) r.push(this.slice(i, i + chunkSize));
    return r;
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};