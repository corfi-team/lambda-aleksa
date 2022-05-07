const BaseEvent = require("../../lib/base/BaseEvent");

module.exports = class messageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "reactionRoleRemove",
                discord: "messageReactionRemove",
            }
        });
    }

    async run(reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch().catch(() => {
        });
        if (reaction.partial) await reaction.fetch().catch(() => {
        });
        const message = reaction.message;
        const rrData = await client.db.reactionrole.get(message.guild.id || " ", message.id || " ", reaction.emoji.name || " ");

        const guild = client.guilds.cache.get(reaction.message.guild.id);
        await user.fetch();
        const user2 = await guild.members.cache.get(user.id);
        for (const rr of rrData) {
            user2.roles.remove(rr.roleid).catch(() => {
            });
        }
    }
};