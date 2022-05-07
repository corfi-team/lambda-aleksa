const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class WinkCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "pat",
                aliases: ["poglaskaj", "poglaszcz", "pogłaszcz", "patpat", "pat-pat"],
            },
            help: {
                description: "Wysyła gifa z głaskaniem postaci anime XD",
                usage: "<p>pat",
                category: "Anime",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("http://nekos.life/api/pat")).json();
        const attachment = new MessageAttachment(data.url, `pat${data.url.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://pat${data.url.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = WinkCommand;