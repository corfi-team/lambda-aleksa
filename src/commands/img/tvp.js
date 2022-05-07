const { MessageAttachment, MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class TvpCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "tvp",
                aliases: ["polskatelewizja", "polska-telewizja"]
            },
            help: {
                description: "Wysyła wiadomości z twoim tekstem.",
                usage: "<p>tvp",
                category: "Obrazki",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args[0] || args.join(" ").length > 44) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu lub jest on większy niż 44 znaki\n\nPoprawne użycie: \`${prefix}tvp <tekst>\``);
        const body = [];
        body.push(`fimg=${encodeURIComponent(Math.floor(Math.random() * 2))}`);
        body.push(`msg=${encodeURIComponent(args.join(" "))}`);
        const image = await fetch("https://pasek-tvpis.pl", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.join("&")
        });
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const attachment = new MessageAttachment(buffer, "tvp.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Tvp`)
            .attachFiles(attachment)
            .setImage("attachment://tvp.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);
        message.channel.stopTyping(1);
    }
}

module.exports = TvpCommand;