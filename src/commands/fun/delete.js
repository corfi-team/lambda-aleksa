const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const canvacord = require("canvacord");

class DeleteCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "delete",
                aliases: ["usuń"]
            },
            help: {
                description: "Usuwa użytkownika",
                usage: "<p>delete <user>",
                category: "Zabawa"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
        const image = await canvacord.Canvas.delete(member.displayAvatarURL(ImageURLOptions));
        const attachment = new MessageAttachment(image, "delete.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Usunieto użytkownika ${member.username}`)
            .attachFiles(attachment)
            .setImage("attachment://delete.png")
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL());
        message.reply(embed);

    }
}

module.exports = DeleteCommand;