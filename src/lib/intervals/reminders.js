const ms = require("../../lib/modules/Ms");
const { MessageEmbed } = require("discord.js");

module.exports = () => {
    setInterval(async () => {
            //TODO: napisanie tego do klasy
            const all = await client.db.reminders.interval();
            for (const remind of all) {
                const user = client.users.cache.get(remind.userid);
                const embed = new MessageEmbed()
                    .setTitle("⏰ Przypomnienie")
                    .setDescription(remind.text)
                    .setColor("GREEN");
                for (let i = 0; i < 4; i++) user.send("[ Wzmianka przypomnienia ]").then(x => x.delete({ timeout: 500 })).catch(() => {
                });
                user.send(embed).catch(() => {
                });

                await client.db.reminders.remove(remind.userid, remind.remindid);
            }
        },
        ms("1m")
    );
};