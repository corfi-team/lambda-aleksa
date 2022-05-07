const ms = require("../../lib/modules/Ms");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("PL");

const { getWinners } = require("../../lib/functions");

module.exports = () => {
    setInterval(async () => {
            //TODO: napisanie tego do klasy
            const all = await client.db.giveaways.interval();
            for (const giveaway of all) {
                const guild = client.guilds.cache.get(giveaway.guildid);
                const channel = client.channels.cache.get(giveaway.channelid);
                if (!guild || !channel) {
                    await client.db.giveaways.remove(giveaway.guildid, giveaway.messageid);
                    continue;
                }
                const msg = await channel.messages.fetch(giveaway.messageid).catch(() => {
                });
                if (!msg) {
                    await client.db.giveaways.remove(giveaway.guildid, giveaway.messageid);
                    continue;
                }
                if (giveaway.end <= Date.now()) {
                    const winners = await getWinners(msg, "🎉", giveaway.winners);
                    const formattedWinners = winners?.map(x => `<@${x?.user?.id}>`).join(", ");
                    if (!winners.length) {
                        const embed = new MessageEmbed()
                            .setTitle("🎉 Giveaway zakończony")
                            .setColor("GREEN")
                            .setDescription("Nikt nie wygrał");
                        msg.edit(embed);

                    } else {
                        const embed = new MessageEmbed()
                            .setTitle("🎉 Giveaway zakończony")
                            .setColor("GREEN")
                            .addField("Nagroda", giveaway.prize)
                            .addField("Zwycięzcy", formattedWinners)
                            .addField("Organizator", `<@${giveaway.author}>`);
                        msg.edit(embed);

                        //await inlineReply(msg, `> Giveaway zakończony\nWygrani: ${formattedWinners}`)
                        //channel.send(`[ Wzmianka wygranych ] ${formattedWinners}`).then(m => m.delete({timeout: 500}));
                    }
                    channel.send(`[ Wzmianka organizator ] <@${giveaway.author}>`).then(m => m.delete({ timeout: 500 }));
                    await client.db.giveaways.end(giveaway.guildid, giveaway.messageid);

                } else {
                    const givEmbed = new MessageEmbed()
                        .setTitle("🎉 Giveaway")
                        .setColor("GREEN")
                        .addField("Nagroda", giveaway.prize)
                        .addField("Ilość zwyciezców", giveaway.winners)
                        .setDescription("Zaznacz reakcje 🎉 by dołączyć")
                        .addField("Organizator", `<@${giveaway.author}>`)
                        .addField("Zakończy sie", `${moment(giveaway.end).fromNow()}`)
                        .addField("Data zakończenia", new Date(giveaway.end).toLocaleString());
                    msg.edit(givEmbed);
                }
            }
        }, ms("1m")
    );
};