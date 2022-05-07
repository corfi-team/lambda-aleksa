const r = require("rethinkdb");

class Reminders {
    constructor(conn) {
        this.conn = conn;
    }

    async add(userID, time, text) {
        const remindid = (await r.table("Reminders").getAll([userID], { index: "getAll" }).coerceTo("array").run(this.conn)).length + 1;

        await r.table("Reminders").insert({
            userid: userID,
            end: time,
            text: text,
            remindid: remindid
        }).run(this.conn);

        return {
            userid: userID,
            end: time,
            text: text,
            remindid: remindid
        };
    }

    async get(userID, remindID) {
        const remind = await r.table("Reminders").getAll([userID, remindID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!remind.length) return null;
        return remind[0];
    }

    async getAll(userID) {
        const remind = await r.table("Reminders").getAll([userID], { index: "getAll" }).orderBy(r.desc("remindid")).coerceTo("array").run(this.conn);
        if (!remind.length) return null;
        return remind;
    }

    async remove(userID, remindID) {
        const remind = await r.table("Reminders").getAll([userID, remindID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!remind.length) return false;
        await r.table("Reminders").get(remind[0].id).delete().run(this.conn);
        return true;
    }

    async interval() {
        return await r.table("Reminders").between(0, Date.now(), { index: "endDate" }).coerceTo("array").run(this.conn);
    }

}

module.exports = Reminders;
