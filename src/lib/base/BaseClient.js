const { Collection, Client } = require("discord.js");

module.exports = class BaseClient extends Client {
    constructor(clientOptions = {}) {
        super(clientOptions);
        this.commands = new Collection();
        this.events = new Collection();
        this.Logger = require("../../lib/modules/Logger");
        this.version = `v${require("../../../package.json").version}`;
        this.footer = `© Delover | ${this.version} STABLE`;
        this.webhooks = require("../modules/Webhooks.js");
        this.functions = require("../functions");
        this.snipes = new Collection();

        delete require.cache[require.resolve("../../lib/modules/Logger")];
        delete require.cache[require.resolve("../../../package.json")];
        delete require.cache[require.resolve("../modules/Webhooks.js")];
        delete require.cache[require.resolve("../functions")];
    }
};
