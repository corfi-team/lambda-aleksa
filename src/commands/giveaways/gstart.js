const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const Ms = require("../../lib/modules/Ms");
const moment = require("moment");

class GstartCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "gstart",
                aliases: ["wystartujlosowanie", "giveawaystart"],
                permissionLevel: 4
            },
            help: {
                description: "Tworzy giveaway",
                usage: "<p>gstart [kanał] <ilość zwyciezców> <czas> <nagroda>",
                category: "Giveaways",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const channel = message.mentions.channels.first() || message.channel;
        if (channel.id !== message.channel.id || args[0]?.includes("<#")) await args.shift();
        if (channel.guild.id !== message.guild.id) return sender.warn("Ten kanał nie jest na tym serwerze");
        if (!channel.permissionsFor(client.user).toArray().includes("SEND_MESSAGES")) return sender.warn(`Niepoprawny argument \`<kanał>\`\nBot nie może pisać na podanym kanale\n\nPoprawne użycie: \`${prefix}gstart [kanał] <ilość zwyciezców> <czas> <nagroda>\``);
        const winnersSize = args[0];
        if (!winnersSize || !parseInt(winnersSize)) return sender.warn(`Niepoprawny argument \`<liczba zwyciezców>\`\nNie podano liczby zwyciezców lub podano nie poprawną\n\nPoprawne użycie: \`${prefix}gstart [kanał] <ilość zwyciezców> <czas> <nagroda>\``);
        const time = Ms(args[1]);
        if (!time) return sender.warn(`Niepoprawny argument \`<czas>\`\nNie podano czasu lub podano zły\n\nPoprawne użycie: \`${prefix}gstart [kanał] <ilość zwyciezców> <czas> <nagroda>\``);
        const prize = args.slice(2).join(" ");
        if (!prize) return sender.warn(`Niepoprawny argument \`<nagroda>\`\nNie podano nagrody\n\nPoprawne użycie: \`${prefix}gstart [kanał] <ilość zwyciezców> <czas> <nagroda>\``);
        if (prize.length > 1028) return sender.warn(`Niepoprawny argument \`<nagroda>\`\nNagroda ma zbyt dużą ilość znaków (wiecej niż \`1028\`)\n\nPoprawne użycie: \`${prefix}gstart [kanał] <ilość zwyciezców> <czas> <nagroda>\``);

        const givEmbed = new MessageEmbed()
            .setTitle("🎉 Giveaway")
            .setColor(message.guild.settings?.colors?.done)
            .addField("Nagroda", prize)
            .addField("Ilość zwyciezców", winnersSize)
            .setDescription("Zaznacz reakcje 🎉 by dołączyć")
            .addField("Organizator", `${message.author}`)
            .addField("Zakończy sie", `${moment(Date.now() + time).fromNow()}`)
            .addField("Data zakończenia", new Date(Date.now() + time).toLocaleString());

        const msg = await channel.send(givEmbed);
        await client.db.giveaways.create(message.guild.id, msg.id, msg.channel.id, message.author.id, "🎉", Date.now() + time, prize, parseInt(winnersSize));
        sender.create(`Stworzono giveaway na kanale <#${channel.id}>`, "🎉 Giveaway");
        await msg.react("🎉");

    }
}

module.exports = GstartCommand;