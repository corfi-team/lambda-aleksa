const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class RedPandaCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "redpanda",
                aliases: ["red-pandy", "red-panda"],
            },
            help: {
                description: "Wysyła zdjęcie pandy.",
                usage: "<p>panda",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/red_panda")).json();
        const attachment = new MessageAttachment(data.link, `red-panda${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://red-panda${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = RedPandaCommand;