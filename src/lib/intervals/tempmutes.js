const ms = require("../../lib/modules/Ms");
const { MessageEmbed } = require("discord.js");
const reason = "Automatyczne odciszenie";

module.exports = () => {
    setInterval(async () => {
            //TODO: napisanie tego do klasy
            const all = await client.db.tempmutes.interval();
            for (const tempban of all) {
                const guild = client.guilds.cache.get(tempban.guildid);
                const user = await guild.members.cache.get(tempban.userid);
                if (!user) {
                    await client.db.punishments.create(tempban.guildid, tempban.userid, client.user.id, reason, "unmute", {
                        created: Date.now(),
                        expires: null
                    }, [], true);
                    await client.db.mutes.remove(tempban.guildid, tempban.userid);
                    await client.db.tempmutes.remove(tempban.guildid, tempban.userid);
                }
                const guildConf = await client.db.servers.get(guild.id);
                if (guildConf.mutedRole) user?.roles?.remove(guildConf.mutedRole).catch(() => {
                    return false;
                });
                //await r.table("Punishments").get(tempban.punishID).update({active: false}).run(client.db.conn);

                //TODO: guildConf.modlog logs

                const { caseid } = await client.db.punishments.create(tempban.guildid, tempban.userid, client.user.id, reason, "unmute", {
                    created: Date.now(),
                    expires: null
                }, [], true);

                await client.db.mutes.remove(tempban.guildid, tempban.userid);

                await client.db.tempmutes.remove(tempban.guildid, tempban.userid);

                let wys;
                await user.send(new MessageEmbed()
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor("RED")
                    .addField("**Serwer:**", guild.name)
                    .addField("**Moderator:**", `${client.user.tag} (\`${client.user.id}\`)`)
                    .addField("**Powód:**", reason)
                    .addField("**Punishment:**", `#${caseid}`)
                    .addField("**Akcja:**", "Automatyczne odciszenie (unmute)")
                ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
                if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
            }
        },
        ms("1m")
    );
};