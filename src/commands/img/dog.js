const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class DogCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "pies",
                aliases: ["psy", "pieski", "sierściuchy", "kundel", "dog", "dogs", "piesobronny"],
            },
            help: {
                description: "Wysyła zdjęcie kotka",
                usage: "<p>kot",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/dog")).json();
        const attachment = new MessageAttachment(data.link, "dog.png");

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage("attachment://dog.png")
        );
    }
}

module.exports = DogCommand;