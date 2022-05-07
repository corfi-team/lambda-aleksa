const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class QRcodeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "qrcode",
                aliases: ["qr"]
            },
            help: {
                description: "Tworzy kod qr",
                usage: "<p>qrcode <tekst>",
                category: "Zabawa"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}qrcode <tekst>\``);

        const image = await fetch("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + args.join(" ")).then(res => res.buffer());

        const attachment = new MessageAttachment(image, "qr.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> QRCode`)
            .attachFiles(attachment)
            .setImage("attachment://qr.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = QRcodeCommand;