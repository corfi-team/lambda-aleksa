const r = require("rethinkdb");

class Punishments {
    constructor(conn) {
        this.conn = conn;
    }

    async create(guildID, userID, moderatorID, reason, type, date = {
        created: Date.now(),
        expires: null
    }, hide = [], active = true) {
        const caseid = (await r.table("Punishments").getAll([guildID], { index: "getAll" }).coerceTo("array").run(this.conn)).length + 1;

        await r.table("Punishments").insert({
            moderatorid: moderatorID,
            userid: userID,
            reason: reason,
            type: type,
            date: date,
            active: active,
            guildid: guildID,
            caseid: caseid,
            hide: hide
        }).run(this.conn);

        return {
            moderatorid: moderatorID,
            userid: userID,
            reason: reason,
            type: type,
            date: date,
            active: active,
            guildid: guildID,
            caseid: caseid,
            hide: hide
        };
    }

    async remove(guildID, caseID, moderatorID) {
        let punish = await r.table("Punishments").getAll([parseInt(caseID), guildID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!punish.length) return false;
        await r.table("Punishments").get(punish[0].id).update({
            active: false,
            deleted: {
                status: true,
                moderatorid: moderatorID
            }
        }).run(this.conn);
        return true;
    }

    async get(guildID, number) {
        const punish = await r.table("Punishments").getAll([parseInt(number), guildID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!punish.length) return false;
        return punish[0];
    }

    async history(guildID, userID) {
        const punishments = await r.table("Punishments").getAll([guildID, userID], { index: "history" }).orderBy(r.desc("caseid")).coerceTo("array").run(this.conn);
        return punishments;
    }

}

module.exports = Punishments;