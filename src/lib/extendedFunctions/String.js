String.prototype.toBoolean = function () {
    switch (this.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case "null":
        case "undefined":
            return false;
        default:
            return Boolean(this);
    }
};

String.prototype.toRandomCase = function () {
    const randomizeCase = (w) => w.split("").map((x) => Math.random() > 0.5 ? x.toUpperCase() : x.toLowerCase()).join("");
    return randomizeCase(this);
};

String.prototype.isAscii = function () {
    if (!this) return true;
    const max_ascii = 127;

    for (let i = 0, strLen = this.length; i < strLen; ++i) {
        if (this.charCodeAt(i) > max_ascii) return true;
    }
    return false;
};