const { MessageAttachment, MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class TrashCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "trash",
            },
            help: {
                description: "Wyrzuca użytkownika",
                usage: "<p>trash <@user>",
                category: "Zabawa"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const all = await fetch(`https://api.alexflipnote.dev/trash?face=${message.author.displayAvatarURL(ImageURLOptions).replace("?size=1024", "")}&trash=${member.displayAvatarURL(ImageURLOptions).replace("?size=1024", "")}`, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        });
        const img = await all.buffer();

        const attachment = new MessageAttachment(img, "trash.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> ${message.author.username} wyrzuca ${member.username}`)
            .attachFiles(attachment)
            .setImage(`attachment://trash.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())

            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);
    }


}

module.exports = TrashCommand;