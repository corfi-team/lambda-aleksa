Map.prototype.array = function () {
    let values = this.values();
    let arr = [];
    for (let i = 0; i < this.size; i++) arr.push(values.next().value);
    return arr;
};
Map.prototype.object = function () {
    const keys = this.keys();
    let object = {};
    for (let i = 0; i < this.size; i++) {
        const key = keys.next().value;
        object[key] = this.get(key);
    }
    return object;
};