const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");

const canvacord = require("canvacord");

class GreyscaleCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "greyscale",
            },
            help: {
                description: "Naklada szara nakladke na avatar użytkownika",
                usage: "<p>greyscale [user]",
                category: "Obrazki"
            }
        });
    }
}

module.exports.run = async (client, message, { args }) => {
    const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
    const image = await canvacord.Canvas.greyscale(member.displayAvatarURL(ImageURLOptions));
    const attachment = new MessageAttachment(image, "greyscale.png");

    const embed = new MessageEmbed()
        .setColor(message.guild.settings?.colors?.done)
        .setTitle(`<:check_green:814098229712781313> Greyscale`)
        .attachFiles(attachment)
        .setImage("attachment://greyscale.png")
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
        .setFooter(client.footer, client.user.displayAvatarURL());

    message.reply(embed);

};
module.exports = GreyscaleCommand;