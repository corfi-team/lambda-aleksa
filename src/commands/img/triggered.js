const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");

class TriggeredCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "triggered",
            },
            help: {
                description: "Naklada flitr triggered na awatar oznaczonego",
                usage: "<p>triggered <user>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const avatar = member.displayAvatarURL({ dynamic: false, format: "png" });
        const image = await canvacord.Canvas.trigger(avatar);
        const attachment = new MessageAttachment(image, "triggered.gif");
        message.channel.startTyping(1);
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Triggered")
            .attachFiles(attachment)
            .setImage(`attachment://triggered.gif`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);
        message.channel.stopTyping(1);

    }
}

module.exports = TriggeredCommand;