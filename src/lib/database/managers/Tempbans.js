const r = require("rethinkdb");

class Tempbans {
    constructor(conn) {
        this.conn = conn;
    }

    async add(guildID, userID, moderatorID, date, active, caseid) {
        await r.table("Tempbans").insert({
            userid: userID,
            guildid: guildID,
            moderatorid: moderatorID,
            active: active,
            date: date,
            punishID: caseid
        }).run(this.conn);
        return {
            userid: userID,
            guildid: guildID,
            moderatorid: moderatorID,
            active: active,
            date: date,
            punishID: caseid
        };
    }

    async remove(guildID, userID) {
        const tb = await r.table("Tempbans").getAll([userID, guildID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!tb[0]) return false;

        await r.table("Tempbans").get(tb[0].id).delete().run(this.conn);
        return true;
    }

    async get(guildID, userID) {
        const tb = await r.table("Tempbans").getAll([guildID, userID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!tb[0]) return false;
        return tb[0];
    }

    async interval() {
        return await r.table("Tempbans").between(0, Date.now(), { index: "endDate" }).coerceTo("array").run(this.conn);
    }
}

module.exports = Tempbans;