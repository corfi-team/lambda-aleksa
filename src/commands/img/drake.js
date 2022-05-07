const { MessageEmbed, MessageAttachment, Util } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class DrakeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "drake",
            },
            help: {
                description: "Tworzy mem drake",
                usage: "<p>drake <tekst 1>; <tekst 2>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.join(" ").includes(";")) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}drake <tekst 1>; <tekst 2>\``);

        let firstArg = args.join(" ").split(";")[0].trim();
        let secondArg = args.join(" ").split(";")[1].trim();

        if (!firstArg) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}drake <tekst 1>; <tekst 2>\``);
        if (!secondArg) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}drake <tekst 1>; <tekst 2>\``);

        firstArg = Util.cleanContent(firstArg, message);
        firstArg = encodeURIComponent(firstArg);
        secondArg = Util.cleanContent(secondArg, message);
        secondArg = encodeURIComponent(secondArg);

        const all = await fetch(`https://api.alexflipnote.dev/drake?top=${firstArg}&bottom=${secondArg}`, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        }).then(res => res.buffer());
        const attachment = new MessageAttachment(all, "drake.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Drake")
            .attachFiles(attachment)
            .setImage("attachment://drake.png")
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL());
        message.reply(embed);

    }
}

module.exports = DrakeCommand;