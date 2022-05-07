const r = require("rethinkdb");

class Backups {
    constructor(conn) {
        this.conn = conn;
    }

    async get(backupID) {
        return (await r.table("Backups").get(backupID).run(this.conn));
    }

    async remove(backupID) {
        const bk = await r.table("Backups").get(backupID).run(this.conn);
        if (!bk) return false;
        await r.table("Backups").get(backupID).delete().run(this.conn);
        return true;
    }

    async create(userID, backupData) {
        const created = await r.table("Backups").insert({
            userid: userID,
            backupData: backupData
        }).run(this.conn);

        return {
            id: created.generated_keys[0]
        };

    }
}

module.exports = Backups;