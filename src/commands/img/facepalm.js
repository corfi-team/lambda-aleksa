const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");

class FacepalmCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "facepalm",
            },
            help: {
                description: "Zmień",
                usage: "<p>facepalm",
                category: "Obrazki",
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const avatar = member.displayAvatarURL({ dynamic: false, format: "png" });

        const image = await canvacord.Canvas.facepalm(avatar);

        const attachment = new MessageAttachment(image, "facepalm.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Facepalm")
            .attachFiles(attachment)
            .setImage(`attachment://facepalm.png`)
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL());

        message.reply(embed);

    }
}

module.exports = FacepalmCommand;