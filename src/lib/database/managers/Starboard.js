const r = require("rethinkdb");

class Starboard {
    constructor(conn) {
        this.conn = conn;
    }

    async add(guildID, channelID, messageID, userID, stars, embedMessage) {
        await r.table("Starboard").insert({
            guildid: guildID,
            channelid: channelID,
            messageid: messageID,
            userid: userID,
            stars: stars,
            embedmessageid: embedMessage
        }).run(this.conn);

        return {
            guildid: guildID,
            channelid: channelID,
            messageid: messageID,
            userid: userID,
            stars: stars,
            embedmessageid: embedMessage
        };
    }

    async get(guildID, messageID) {
        const query = await r.table("Starboard").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);
        if (query.length) return query[0];
        return null;
    }

    async update(guildID, messageID, data) {
        const query = await r.table("Starboard").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);

        if (!query) return false;

        await r.table("Starboard").get(query[0].id).update(data).run(this.conn);

        return true;
    }

    async remove(guildID, messageID) {
        const query = await r.table("Starboard").getAll([guildID, messageID], { index: "get" }).coerceTo("array").run(this.conn);

        if (!query.length) return false;

        await r.table("Starboard").get(query[0].id).delete().run(this.conn);

        return true;
    }
}

module.exports = Starboard;

