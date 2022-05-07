const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

class AvatarCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "avatar",
                aliases: ["awatar", "profilowe", "zdjecie"],
            },
            help: {
                description: "Pokazuje avatar uzytkownika",
                usage: "<p>avatar <Użytkownik>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args }) {
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        let desc = `[png](${target.displayAvatarURL({
            size: 1024,
            format: "png"
        })}) | [jpg](${target.displayAvatarURL({
            size: 1024,
            format: "jpg"
        })}) | [webp](${target.displayAvatarURL({ size: 1024, format: "webp" })})`;
        if (target.displayAvatarURL({ dynamic: true }).endsWith(".gif")) desc += ` | [gif](${target.displayAvatarURL({
            size: 1024,
            format: "gif"
        })})`;

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings.colors.done)
            .setTitle(target.tag)
            .setDescription(`» ${desc} «`)
            .setImage(target.displayAvatarURL(ImageURLOptions))
        );
    }

}

module.exports = AvatarCommand;