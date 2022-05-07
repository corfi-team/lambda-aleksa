const r = require("rethinkdb");

class Tempmutes {
    constructor(conn) {
        this.conn = conn;
    }

    async add(guildID, userID, moderatorID, date, active, caseid) {
        await r.table("Tempmutes").insert({
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
        const tb = await r.table("Tempmutes").getAll([userID, guildID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!tb[0]) return false;

        await r.table("Tempmutes").get(tb[0].id).delete().run(this.conn);
        return true;
    }

    async get(guildID, userID) {
        const tb = await r.table("Tempmutes").getAll([guildID, userID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!tb[0]) return false;
        return tb[0];
    }

    async interval() {
        return await r.table("Tempmutes").between(0, Date.now(), { index: "endDate" }).filter(r.row("active").eq(true)).coerceTo("array").run(this.conn);
    }

}

module.exports = Tempmutes;