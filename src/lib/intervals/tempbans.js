const ms = require("../../lib/modules/Ms");

module.exports = () => {
    setInterval(async () => {
            //TODO: napisanie tego do klasy
            const all = await client.db.tempbans.interval();
            for (const tempban of all) {
                const guild = client.guilds.cache.get(tempban.guildid);
                try {
                    await guild.members.unban(tempban.userid);
                } catch {
                }

                //TODO: guildConf.modlog channel embed

                const reason = "Automatyczne odbanowanie";

                await client.db.punishments.create(tempban.guildid, tempban.userid, client.user.id, reason, "unban", {
                    created: Date.now(),
                    expires: null
                }, [], true);

                await client.db.tempbans.remove(tempban.guildid, tempban.userid);
            }
        },
        ms("1m")
    );
};