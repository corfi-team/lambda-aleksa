const r = require("rethinkdb");

class Users {
    constructor(conn) {
        this.conn = conn;
    }

    async get(userID) {
        let prof = await r.table("Users").get(userID).run(this.conn);
        if (!prof) prof = await this.setDefault(userID);
        return prof;
    }

    async update(userID, settings) {
        return await r.table("Users").get(userID).update(settings).run(this.conn);
    }

    async setDefault(userID) {
        await r.table("Users").insert({
            id: userID,
        }).run(this.conn);
        return {
            id: userID,
        };
    }
}

module.exports = Users;