const r = require("rethinkdb");

class GiveawaysManager {
    constructor(conn) {
        this.conn = conn;
    }

    async create(guildID, messageID, channelID, authorID, reaction, end, prize, winners = 1, ended = false) {
        await r.table("Giveaways").insert({
            guildid: guildID,
            messageid: messageID,
            channelid: channelID,
            reaction: reaction,
            ended: ended,
            winners: winners,
            end: end,
            prize: prize,
            author: authorID
        }).run(this.conn);
        return {
            guildid: guildID,
            messageid: messageID,
            channelid: channelID,
            reaction: reaction,
            ended: ended,
            winners: winners,
            end: end,
            prize: prize,
            author: authorID
        };
    }

    async end(guildID, messageID) {
        const giveaway = await r.table("Giveaways").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!giveaway.length) return false;
        if (giveaway[0].ended) return { err: "This giveaway is ended" };
        await r.table("Giveaways").get(giveaway[0].id).update({ ended: true }).run(this.conn);
        return giveaway[0];
    }

    async remove(guildID, messageID) {
        const giveaway = await r.table("Giveaways").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);
        if (!giveaway.length) return false;
        await r.table("Giveaways").get(giveaway[0].id).delete().run(this.conn);
        return giveaway[0];
    }

    async get(guildID, messageID) {
        const giveaway = await r.table("Giveaways").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);
        return giveaway[0] || null;
    }

    async list(guildID) {
        return await r.table("Giveaways").getAll([guildID], { index: "list" }).coerceTo("array").run(this.conn);
    }

    async interval() {
        return await r.table("Giveaways").filter(r.row("ended").eq(false)).coerceTo("array").run(this.conn);
    }
}

module.exports = GiveawaysManager;