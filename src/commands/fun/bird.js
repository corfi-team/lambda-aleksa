const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class BirdCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "ptaki",
                aliases: ["ptak", "ptaszek", "bird", "birds", "birb"],
            },
            help: {
                description: "Wysyła zdjęcie ptaka (tym razem nie chodzi o kutasa ( ͡° ͜ʖ ͡°))",
                usage: "<p>kot",
                category: "Zabawa",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/birb")).json();
        const attachment = new MessageAttachment(data.link, `bird${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://bird${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = BirdCommand;