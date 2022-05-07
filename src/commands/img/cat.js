const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");
const { MessageEmbed, MessageAttachment } = require("discord.js");

class CatCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "kot",
                aliases: ["koty", "cat", "cats", "pchlarz", "pchlarze"],
            },
            help: {
                description: "Wysyła zdjęcie kotka",
                usage: "<p>kot",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/cat")).json();
        const attachment = new MessageAttachment(data.link, `cat${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://cat${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = CatCommand;