const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class ShipCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "ship",
            },
            help: {
                category: "Zabawa",
                description: "Shipuje uytkownika",
                usage: "[p]ship <@user> <@user>"
            }
        });

    }

    async run(message, { args }) {
        const shipped = await client.functions.getUser(message, args[1]) || await client.functions.fetchUser(message, args[1]) || args[1] || message.author;
        const shipper = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || args[0] || message.author;
        const score = Math.random() * (0, 100);
        const prog_bar = Math.ceil(Math.round(score) / 100 * 10);
        const counter = "◻️".repeat(prog_bar) + "◼️".repeat(10 - prog_bar);
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setTitle(`${shipper.username ? shipper.username : shipper} ❤ ${shipped.username ? shipped.username : shipped}`)
            .setDescription(`**Miłość ${Math.round(score)}%**\n${counter}\n`)
            .setColor(message.guild.settings?.colors?.done);
        if (typeof shipper === "object" && typeof shipped === "object") {
            message.channel.startTyping(1);
            let all = await fetch(`https://api.alexflipnote.dev/ship?user=${shipped.displayAvatarURL({ format: "png" })}&user2=${shipper.displayAvatarURL({ format: "png" })}`, {
                method: "GET",
                headers: { "Authorization": client.config.tokens.apis.alexflipnote },
            }).then(res => res.buffer());
            const attachment = new MessageAttachment(all, "ship.png");
            embed.attachFiles(attachment).setImage(`attachment://ship.png`);
        }
        message.reply(embed);
        message.channel.stopTyping(1);

    }
}

module.exports = ShipCommand;
