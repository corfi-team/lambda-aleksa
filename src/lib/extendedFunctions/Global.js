global.extendedtypeof = function (x) {
    const type = typeof x;
    if (type === "object") {
        if (x instanceof RegExp) return "regexp";
        if (x instanceof Map) return "map";
        if (x instanceof Array) return "array";
        if (x === null) return "null";
        if (x.toString() === "[object Promise]") return "promise";
        return "object";
    } else if (type === "number") {
        if (Math.floor(x) !== x) return "float";
        return "integer";
    } else if (type === "function") {
        if (x.toString().startsWith("(")) return "arrowfunction";
        if (x.toString().startsWith("async (")) return "asyncarrowfunction";
        if (x.toString().startsWith("async")) return "asyncfunction";
        if (x.toString().startsWith("class")) return "class";
        return "function";
    } else return type;
};