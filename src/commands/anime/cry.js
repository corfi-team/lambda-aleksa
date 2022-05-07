const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class HugCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "cry",
                aliases: ["placz"],
            },
            help: {
                description: "Wysyła gifa płączącej postaci",
                usage: "<p>cry",
                category: "Anime",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://neko-love.xyz/api/v1/cry")).json();
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