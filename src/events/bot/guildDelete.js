const BaseEvent = require("../../lib/base/BaseEvent");

module.exports = class guildCreateEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "guildDelete",

                discord: "guildDelete",
            }
        });
    }

    async run(guild) {
        // let channels = guild.channels.cache;
        // let channelID;
        // const fetchedLogs = await guild.fetchAuditLogs({
        //     limit: 1,
        //     type: "ADD_BOT"
        // });

        client.webhooks.serverLog(guild, "Delover został usunięty z serwera.", "RED");
    }
};