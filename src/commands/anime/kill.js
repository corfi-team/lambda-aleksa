const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class HugCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "kill",
                aliases: ["zabij"]
            },
            help: {
                description: "Wysyła gifa zabijających sie postaci anime",
                usage: "<p>kill",
                category: "Anime",
            }
        });
    }

    async run(message) {

        const links = [
            "https://cdn.weeb.sh/images/HyXTiyKw-.gif",
            "https://cdn.weeb.sh/images/r11as1tvZ.gif",
            "https://cdn.weeb.sh/images/B1qosktwb.gif",
            "https://cdn.weeb.sh/images/BJO2j1Fv-.gif",
            "https://cdn.weeb.sh/images/B1VnoJFDZ.gif"
        ];

        const data = links.random();
        const attachment = new MessageAttachment(data, `kill${data.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://kill${data.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = HugCommand;