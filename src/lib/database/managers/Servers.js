const r = require("rethinkdb");

class Servers {
    constructor(conn) {
        this.conn = conn;
    }

    async get(guildID) {
        return await r.table("Guilds").get(guildID).run(this.conn) || await this.setDefault(guildID);
    }

    async setDefault(guildID) {
        const obj = {
            goodbye: {
                channel: null,
                color: "GREEN",
                message: "Żegnaj {user.tag}",
                status: false,
                title: "Użytkownik wyszedł"
            },
            welcome: {
                channel: null,
                color: "GREEN",
                message: "Witaj {user}",
                status: false,
                title: "Użytkownik wszedł"
            },
            id: guildID,
            mutedRole: null,
            modlogChannel: null,
            colors: {
                done: "#34eb43",
                error: "#e66465",
                warn: "#ebe134"
            },
            prefixes: [
                "&"
            ],
            proposals: {
                channels: [],
                status: false,
                comment: "//",
            },
            leveling: {
                roles: [],
                status: false,
                xpNeeded: 170,
                messageNewLevel: "Gratuluje! Zdobyłeś/aś poziom {level}",
                messageNewLevelType: "msgChannel",
                messageNewLevelChannel: null
            },
            antyinvite: {
                status: false,
                roles: [],
                channels: [],
                users: [],
            },
            starboard: {
                status: false,
                channel: null,
                authorStar: false,
                emoji: "⭐",
                reactionCount: 2
            },
            permissions: {
                roles: []
            },
            logs: {
                status: false,
                channel: null
            }
        };
        await r.table("Guilds").insert(obj).run(this.conn);
        return obj;
    }

    async update(guildID, settings) {
        return await r.table("Guilds").get(guildID).update(settings).run(this.conn);
    }

}

module.exports = Servers;

