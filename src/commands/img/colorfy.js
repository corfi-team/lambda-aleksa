const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

const canvacord = require("canvacord");

class ColorfyCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "colorfy",
            },
            help: {
                description: "Wysyła avatar użytkownika w podanym kolorze HEX",
                usage: "<p>colorfy <hex> [użytkownik]",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<hex>\`\nNie podano koloru hex\n\nPoprawne użycie: \`${prefix}colorfy <hex> [użytkownik]\``);
        const member = await client.functions.getUser(message, args[1]) || await client.functions.fetchUser(message, args[1]) || message.author;
        if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(args[0])) return sender.warn(`Niepoprawny argument \`<hex>\`\nNie podano koloru hex\n\nPoprawne użycie: \`${prefix}colorfy <hex> [użytkownik]\``);
        let image = await canvacord.Canvas.colorfy(member.displayAvatarURL(ImageURLOptions), args[0]);

        const attachment = new MessageAttachment(image, "colorfy.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Colorfy`)
            .attachFiles(attachment)
            .setImage("attachment://colorfy.png")
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL());

        message.reply(embed);

    }
}

module.exports = ColorfyCommand;