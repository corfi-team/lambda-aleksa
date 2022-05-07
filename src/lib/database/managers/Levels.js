const r = require("rethinkdb");

class Levels {
    constructor(conn) {
        this.conn = conn;
    }

    async get(guildID, userID) {
        const info = await r.table("Leveling").getAll([guildID, userID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!info.length) return await this.setDefault(guildID, userID);
        return info[0];
    }

    async setDefault(guildID, userID) {
        await r.table("Leveling").insert({
            xp: 0,
            level: 0,
            userid: userID,
            guildid: guildID,
        }).run(this.conn);
        return {
            xp: 0,
            level: 0,
            userid: userID,
            guildid: guildID,
        };
    }

    async update(guildID, userID, data) {
        const gett = await this.get(guildID, userID);
        if (!gett) return false;
        await r.table("Leveling").get(gett.id).update(data).run(this.conn);
        return true;
    }

    async getAll(guildID) {
        return (await r.table("Leveling").getAll([guildID], { index: "getAll" }).orderBy(r.desc("level"), r.desc("xp")).coerceTo("array").run(this.conn));//?.reverse();
    }

}

module.exports = Levels;