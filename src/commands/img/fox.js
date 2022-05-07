const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class FoxCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "lis",
                aliases: ["lisy", "furrasyirl", "jebacfurry", "liski"],
            },
            help: {
                description: "Wysyła zdjęcie ptaka (tym razem nie chodzi o kutasa ( ͡° ͜ʖ ͡°))",
                usage: "<p>kot",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/fox")).json();
        const attachment = new MessageAttachment(data.link, `fox${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://fox${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = FoxCommand;