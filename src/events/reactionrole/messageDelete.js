const BaseEvent = require("../../lib/base/BaseEvent");
const r = require("rethinkdb");

module.exports = class messageDeleteEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "reactionRoleMessageDelete",
                discord: "messageDelete",
            }
        });
    }

    async run(message) {
        if (message.partial) await message.fetch().catch(() => {
        });
        const rrData = await client.db.reactionrole.getDel(message.guild.id || " ", message.id || " ");
        for (const db of rrData) {
            await r.table("ReactionRoles").get(db.id).delete().run(client.db.conn);
        }
    }
};