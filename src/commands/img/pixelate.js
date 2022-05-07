const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");

class PixelateCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "pixelate",
            },
            help: {
                description: "Pikseluje avatar użytkownika",
                usage: "<p>pixelate [user]",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const image = await canvacord.Canvas.pixelate(member.displayAvatarURL(ImageURLOptions), 5);
        const attachment = new MessageAttachment(image, "pixelate.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Pixelate`)
            .attachFiles(attachment)
            .setImage("attachment://pixelate.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = PixelateCommand;