const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class KoalaCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "koala",
                aliases: ["koal", "koale"],
            },
            help: {
                description: "Wysyła zdjęcie koali",
                usage: "<p>koala",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/koala")).json();
        const attachment = new MessageAttachment(data.link, `koala${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://koala${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = KoalaCommand;