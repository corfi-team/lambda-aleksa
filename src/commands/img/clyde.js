const { MessageEmbed, MessageAttachment, Util } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");


class ClydeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "clyde",
            },
            help: {
                description: "Tworzy wiadomosc wyslana od clyde",
                usage: "<p>clyde <tekst>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}clyde <tekst>\``);

        message.channel.startTyping(1);
        const body = await fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${encodeURIComponent(Util.cleanContent(args.join(" "), message))}`).then(r => r.json());
        message.channel.stopTyping(1);
        const attachment = new MessageAttachment(`${body.message}`, "clyde.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Clyde")
            .attachFiles(attachment)
            .setImage(`attachment://clyde.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);

    }
}

module.exports = ClydeCommand;