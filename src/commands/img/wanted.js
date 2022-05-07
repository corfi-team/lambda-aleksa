const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

const canvacord = require("canvacord");

class WantedCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "wanted",
            },
            help: {
                description: "Tworzy obrazek \"wanted\" z avatarem użytkownika",
                usage: "<p>wanted <user>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args }) {

        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const image = await canvacord.Canvas.wanted(member.displayAvatarURL(ImageURLOptions));
        const attachment = new MessageAttachment(image, "wanted.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Wanted")
            .attachFiles(attachment)
            .setImage(`attachment://wanted.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = WantedCommand;