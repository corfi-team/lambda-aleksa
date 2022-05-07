const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class PikachuCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "pikachu",
                aliases: ["pikaczu", "pikachuj"],
            },
            help: {
                description: "Wysyła zdjęcie pikachu",
                usage: "<p>kot",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/pikachu")).json();
        const attachment = new MessageAttachment(data.link, `pikachu${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://pikachu${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = PikachuCommand;