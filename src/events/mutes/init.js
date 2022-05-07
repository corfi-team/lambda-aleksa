const BaseEvent = require("../../lib/base/BaseEvent");
module.exports = class guildCreateEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "muteInit",
                discord: "guildCreate",
            }
        });
    }

    async run(guild) {
        const guildConf = await client.db.servers.get(guild.id);
        if (guildConf.mutedRole && guild.roles.cache.get(guildConf.mutedRole)) {
            const role = guild.roles.cache.get(guildConf.mutedRole);
            guild.channels.cache.forEach(channel => {
                channel.updateOverwrite(role, {
                    SEND_MESSAGES: false,
                    SPEAK: false,
                    ADD_REACTIONS: false
                }).catch(() => {
                });
            });
            if (role) await client.db.servers.update(guild.id, { mutedRole: role.id });
        } else {
            guild.roles.create({
                data: {
                    name: "Wyciszony",
                    color: "#ff1100",
                    permissions: []
                }
            }).then(async role => {
                guild.channels.cache.forEach(async channel => {
                    channel.updateOverwrite(role, { SEND_MESSAGES: false, SPEAK: false }).catch(() => {
                    });
                    if (!role) await client.db.servers.update(guild.id, { mutedRole: role.id });
                    if (role) await client.db.servers.update(guild.id, { mutedRole: role.id });
                });
            }).catch(() => {
            });
        }
    }
};