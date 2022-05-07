const r = require("rethinkdb");

class Autoresponders {
    constructor(conn) {
        this.conn = conn;
    }

    async get(guildID, arid) {
        const ar = await r.table("Autoresponders").getAll([arid, guildID], { index: "get" }).orderBy(r.desc("arid")).coerceTo("array").run(this.conn);
        return ar[0];
    }

    async getAll(guildID) {
        return await r.table("Autoresponders").getAll([guildID], { index: "getAll" }).orderBy(r.desc("arid")).coerceTo("array").run(this.conn);
    }

    async add(guildID, reply, msg) {
        const id = (await r.table("Autoresponders").getAll([guildID], { index: "getAll" }).coerceTo("array").run(this.conn)).length + 1;
        await r.table("Autoresponders").insert({
            guildid: guildID,
            arid: id,
            msg: msg,
            reply: reply
        }).run(this.conn);

        return {
            guildid: guildID,
            arid: id,
            msg: msg,
            reply: reply
        };
    }

    async remove(guildID, arid) {
        const ar = await r.table("Autoresponders").getAll([parseInt(arid), guildID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!ar || !ar[0]) return false;
        await r.table("Autoresponders").get(ar[0].id).delete().run(this.conn);
        return true;
    }

    async use(guildID, content) {
        return await r.table("Autoresponders").getAll([content, guildID], { index: "use" }).coerceTo("array").run(this.conn);
    }
}

module.exports = Autoresponders;