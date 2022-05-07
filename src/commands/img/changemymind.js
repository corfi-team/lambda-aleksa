const { MessageEmbed, MessageAttachment, Util } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");


class ChangeMyMindCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "changemymind",
                aliases: ["cmm"]
            },
            help: {
                description: "Tworzy obrazek \"changemymind\"",
                usage: "<p>changemymind <tekst>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}changemymind <tekst>\``);
        message.channel.startTyping(1);
        const cmm = await fetch(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${encodeURIComponent(Util.cleanContent(args.join(" "), message))}`).then(res => res.json());
        message.channel.stopTyping(1);
        const attachment = new MessageAttachment(`${cmm.message}`, "cmm.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Changemymind")
            .attachFiles(attachment)
            .setImage("attachment://cmm.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);

    }
}

module.exports = ChangeMyMindCommand;