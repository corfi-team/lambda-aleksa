const BaseEvent = require("../../lib/base/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "muteChannel",
                discord: "channelCreate"
            }
        });
    }

    async run(channel) {
        if (!channel || !channel.guild) return;
        const guildConf = await client.db.servers.get(channel.guild.id);
        const muterole = guildConf.mutedRole;
        if (!muterole) return;
        const role = channel.guild.roles.cache.get(muterole);
        if (!role) return;
        channel.updateOverwrite(role, { SEND_MESSAGES: false, SPEAK: false, ADD_REACTIONS: false }).catch(r => {
        });
    }
};