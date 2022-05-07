const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");

class RipCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "rip",
            },
            help: {
                description: "Tworzy avatar jak umierasz",
                usage: "<p>rip [user]",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args }) {

        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const image = await canvacord.Canvas.rip(member.displayAvatarURL(ImageURLOptions));
        const attachment = new MessageAttachment(image, "rip.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> RIP")
            .attachFiles(attachment)
            .setImage(`attachment://rip.png`)
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL());

        message.reply(embed);
    }

}

module.exports = RipCommand;