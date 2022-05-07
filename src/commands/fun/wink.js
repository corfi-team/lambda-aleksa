const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class WinkCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "wink",
                aliases: ["mrug", "mrugniecie", "oczko"],
            },
            help: {
                description: "Wysyła gifa z postacią anime puszczającą oczko",
                usage: "<p>wink",
                category: "Zabawa",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/animu/wink")).json();
        const attachment = new MessageAttachment(data.link, "wink.png");

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage("attachment://wink.png")
        );
    }
}

module.exports = WinkCommand;