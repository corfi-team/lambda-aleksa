const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");
const { MessageEmbed, MessageAttachment } = require("discord.js");

class BlurCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "blur",
            },
            help: {
                description: "Naklada nakladke \"blur\" na avatar użytkownika",
                usage: "<p>blur [user]",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const image = await canvacord.Canvas.blur(member.displayAvatarURL(ImageURLOptions));

        const attachment = new MessageAttachment(image, "blur.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Blur`)
            .attachFiles(attachment)
            .setImage("attachment://blur.png")
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);

    }
}

module.exports = BlurCommand;