const BaseEvent = require("../../lib/base/BaseEvent");

module.exports = class WelcomeEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "muteLeave",
                discord: "guildMemberAdd",
            }
        });
    }

    async run(member) {

        await member.fetch().catch(() => {
        });

        if (await client.db.mutes.get(member.guild.id, member.id)) {
            const guildConf = client.db.servers.get(member.guild.id);
            const muterole = guildConf.mutedRole;
            if (!muterole) return;
            const role = member.guild.roles.cache.get(muterole);
            if (!role) return;
            member.roles.add(role, { reason: `User is muted! Unmute this user using ${guildConf.prefixes[0]}unmute <user>` }).catch(() => {
            });
        }
    }
};