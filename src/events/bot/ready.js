const BaseEvent = require("../../lib/base/BaseEvent");
const chalk = require("chalk");

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "ready",

                discord: "ready",
            }
        });
    }

    async run() {
        if (!client.config.settings.debug) {
            client.Logger.log(client.user.tag + " Ready!");
        }

        client.user.setPresence({
            status: "dnd",
            activity: { type: "WATCHING", name: "@Delover" }
        });
        if (client.config.settings.node !== "development") client.webhooks.ready();
    }
};