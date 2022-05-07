const Database = require("./database");
const fs = require("fs");

const mapDir = (dir) => {
    const dirs = {};
    for (const file of fs.readdirSync(`./src/lib/${dir}`)) dirs[file.split(".")[0]] = require(`./${dir}/${file}`);
    return dirs;
};

module.exports = {
    modules: mapDir("modules"),
    apis: mapDir("apis"),
    base: mapDir("base"),
    config: new (require("./config"))(),
};

global.ImageURLOptions = {
    format: "png",
    dynamic: true,
    size: 1024,
};

module.exports.init = async (client) => {

    const db = new Database();
    await db.connect({ db: "Delover" });
    client.db = client.database = db;

    global.client = client;

    require("./modules/SlashCommands").init();

    client.functions = require("./functions");

    require("./intervals")();

    require("./extendedFunctions");

    require("../dashboard/index");

    const registry = require("./handlers/registry");

    registry.registerCommands();
    registry.registerEvents();

    delete require.cache[require.resolve("./handlers/registry")];
    delete require.cache[require.resolve("../dashboard/index")];
    delete require.cache[require.resolve("./intervals")];
    delete require.cache[require.resolve("./functions")];
    delete require.cache[require.resolve("./modules/SlashCommands")];
};