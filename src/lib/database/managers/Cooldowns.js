const r = require("rethinkdb");

class Backups {
    constructor(conn) {
        this.conn = conn;
    }

    async get(userID, key) {
        const row = await r.table("Cooldowns").getAll([userID, key], { index: "get" }).coerceTo("array").run(this.conn);

        return row[0];
    }

    async set(userID, key, date) {
        if (!await this.get(userID, key)) {
            await r.table("Cooldowns").insert({
                userid: userID,
                key: key,
                date: date
            }).run(this.conn);
            return true;
        } else {
            const db = await this.get(userID, key);

            await r.table("Cooldowns").get(db.id).update({
                date: date
            }).run(this.conn);
            return true;
        }
    }

}

module.exports = Backups;