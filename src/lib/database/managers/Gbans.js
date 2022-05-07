const r = require("rethinkdb");

class Gbans {
    constructor(conn) {
        this.conn = conn;
    }

    async add(userID, moderatorID, reason) {
        if (await r.table("Gbans").get(userID).run(this.conn)) return false;
        await r.table("Gbans").insert({
            id: userID,
            reason: reason,
            developer: moderatorID,
            date: Date.now(),
            status: true,
        }).run(this.conn);
        return true;
    }

    async remove(userID) {
        const user = await r.table("Gbans").get(userID).run(this.conn);
        if (!user) return false;
        await r.table("Gbans").get(userID).delete().run(this.conn);
        return true;
    }

    async get(userID) {
        return await r.table("Gbans").get(userID).run(this.conn);
    }

    async list() {
        return await r.table("Gbans").coerceTo("array").run(this.conn);
    }

}

module.exports = Gbans;