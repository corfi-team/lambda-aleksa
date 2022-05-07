const fs = require("fs");

module.exports = async () => {
    const files = fs.readdirSync("./src/lib/intervals").filter(file => file.endsWith(".js") && file !== "index.js");

    for (const file of files) {
        const handler = require(`./${file}`);
        handler();
    }
};