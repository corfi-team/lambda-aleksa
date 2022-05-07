const r = require("rethinkdb");

class ReactionRole {
    constructor(conn) {
        this.conn = conn;
    }

    async add(guildID, channelID, messageID, emoji, roleID) {
        await r.table("ReactionRoles").insert({
            guildid: guildID,
            channelid: channelID,
            messageid: messageID,
            emoji: emoji,
            roleid: roleID
        }).run(this.conn);
        return true;
    }

    async remove(guildID, messageID, emoji) {
        const rr = await r.table("ReactionRoles").getAll([guildID, messageID, emoji], { index: "get" }).coerceTo("array").run(this.conn);
        if (!rr.length) return false;
        await r.table("ReactionRoles").get(rr[0].id).delete().run(this.conn);
        return true;
    }

    async get(guildID, messageID, emoji) {
        return await r.table("ReactionRoles").getAll([guildID, messageID, emoji], { index: "get" }).coerceTo("array").run(this.conn);
    }

    async getDel(guildID, messageID) {
        return await r.table("ReactionRoles").getAll([guildID, messageID], { index: "getDelete" }).coerceTo("array").run(this.conn);
    }
}

module.exports = ReactionRole;