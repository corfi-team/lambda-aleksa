const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class HugCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "hug",
                aliases: ["przytul", "przytulas"],
            },
            help: {
                description: "Wysyła gifa przytulających sie postaci anime",
                usage: "<p>hug",
                category: "Anime",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("http://nekos.life/api/hug")).json();
        const attachment = new MessageAttachment(data.url, `hug${data.url.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://hug${data.url.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = HugCommand;