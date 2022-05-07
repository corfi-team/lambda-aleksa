const BaseEvent = require("../../lib/base/BaseEvent");
module.exports = class messageDeleteEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "starboardMessageDelete",
                discord: "messageDelete",
            }
        });
    }


    async run(message) {
        if (message.partial) await message.fetch().catch(() => {
        });
        if (!message.guild) return;
        const guildConf = await client.db.servers.get(message.guild.id);
        if (!guildConf.starboard.status) return;
        const dbGet = await client.db.starboard.get(message.guild.id, message.id);
        if (!dbGet) return;

        await client.db.starboard.remove(message.guild.id, message.id);

        const channel = client.channels.cache.get(guildConf.starboard.channel);

        if (!channel) return;

        const existingMsg = await channel.messages.fetch(dbGet.embedmessageid).catch(() => {
        });
        if (!existingMsg) return;
        existingMsg.delete({ timeout: 500 });
    }
};