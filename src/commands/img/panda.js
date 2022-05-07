const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class PandaCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "panda",
                aliases: ["pandy", "pandzia"],
            },
            help: {
                description: "Wysyła zdjęcie pandy.",
                usage: "<p>panda",
                category: "Obrazki",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://some-random-api.ml/img/panda")).json();
        const attachment = new MessageAttachment(data.link, `panda${data.link.endsWith(".gif") ? ".gif" : ".png"}`);

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage(`attachment://panda${data.link.endsWith(".gif") ? ".gif" : ".png"}`)
        );
    }
}

module.exports = PandaCommand;