const r = require("rethinkdb");

class Mutes {
    constructor(conn) {
        this.conn = conn;
    }

    async add(guildID, userID, moderatorID) {
        await r.table("Mutes").insert({
            userid: userID,
            guildid: guildID,
            moderatorid: moderatorID,
            active: true,
        }).run(this.conn);
        return true;
    }

    async remove(guildID, userID) {
        const rm = await r.table("Mutes").getAll([guildID, userID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!rm[0]) return false;
        r.table("Mutes").get(rm[0].id).delete().run(this.conn);
        return true;
    }

    async get(guildID, userID) {
        const val = await r.table("Mutes").getAll([guildID, userID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!val.length) return false;
        return val[0];

    }
}

module.exports = Mutes;
