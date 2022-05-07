const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { getWinners } = require("../../lib/functions");

class GrerollCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "greroll",
                aliases: ["rozlosujponownielosowanie"],
                permissionLevel: 4
            },
            help: {
                description: "Rozlosowuje ponownie giveaway",
                usage: "<p>greroll <ID>",
                category: "Giveaways",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args[0]) return sender.warn(`Niepoprawny argument \`<ID>\`\nNie podano id wiadomości z giveawayem\n\nPoprawne użycie: \`${prefix}gend <ID>\``);
        const giveaway = await client.db.giveaways.get(message.guild.id, args[0]);
        if (!giveaway) return sender.warn(`Niepoprawny argument \`<ID>\`\nNie znaleziono takiego giveawaya\n\nPoprawne użycie: \`${prefix}gend <ID>\``);
        if (!giveaway.ended) return sender.warn(`Niepoprawny argument \`<ID>\`\nTen giveaway nie jest zakończony\n\nPoprawne użycie: \`${prefix}gend <ID>\``);
        const channel = client.channels.cache.get(giveaway.channelid);
        if (!channel) return sender.warn(`Niepoprawny argument \`<ID>\`\nNie znaleziono wiadomości z giveawayem\n\nPoprawne użycie: \`${prefix}gend <ID>\``);
        const msg = await channel.messages.fetch(giveaway.messageid);
        if (!msg) return sender.warn(`Niepoprawny argument \`<ID>\`\nNie znaleziono wiadomości z giveawayem\n\nPoprawne użycie: \`${prefix}gend <ID>\``);
        const winners = await getWinners(msg, "🎉", giveaway.winners);
        const formattedWinners = winners.map(x => `<@${x.user.id}>`).join(", ");
        if (!winners.length) {
            const embed = new MessageEmbed()
                .setTitle("🎉 Giveaway zakończony")
                .setColor(message.guild.settings?.colors?.done)
                .setDescription("Nikt nie wygrał");
            msg.edit(embed);
            //await inlineReply(msg, `> Giveaway zakończony\nNikt nie wygrał`)

        } else {
            const embed = new MessageEmbed()
                .setTitle("🎉 Giveaway zakończony")
                .setColor(message.guild.settings?.colors?.done)
                .addField("Nagroda", giveaway.prize)
                .addField("Zwycięzcy", formattedWinners)
                .addField("Organizator", `<@${giveaway.author}>`);
            msg.edit(embed);
            //await inlineReply(msg, `> Giveaway zakończony\nWygrani: ${formattedWinners}`)
            channel.send(`[ Wzmianka wygranych ] ${formattedWinners}`).then(m => m.delete({ timeout: 500 }));
        }
        channel.send(`[ Wzmianka organizator ] <@${giveaway.author}>`).then(m => m.delete({ timeout: 500 }));

        await sender.create(`Rozlosowano ponownie giveaway na kanale <#${giveaway.channelid}>`, "🎉 Giveaway", "Poczekaj minute na zakończenie giveawaya");
    }
}

module.exports = GrerollCommand;