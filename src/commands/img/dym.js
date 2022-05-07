const { MessageEmbed, MessageAttachment, Util } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");

const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class Dym extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "dym",
                aliases: ["didyoumine"],
            },
            help: {
                description: "Tworzy obrazek \"Did You Mean?\" z google",
                usage: "<p>dym <text 1>; <text 2>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.join(" ").includes(";")) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}didyoumine <tekst 1>; <tekst 2>\``);

        let firstArg = args.join(" ").split(";")[0].trim();
        let secondArg = args.join(" ").split(";")[1].trim();

        if (!firstArg) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}didyoumine <tekst 1>; <tekst 2>\``);
        if (!secondArg) return sender.warn(`Niepoprawny argument \`<tekst 1>\`\nNie podano tekstu pierwszego\n\nPoprawne użycie: \`${prefix}didyoumine <tekst 1>; <tekst 2>\``);
        firstArg = Util.cleanContent(firstArg, message);
        firstArg = encodeURIComponent(firstArg);
        secondArg = Util.cleanContent(secondArg, message);
        secondArg = encodeURIComponent(secondArg);
        let all = await fetch(`https://api.alexflipnote.dev/didyoumean?top=${firstArg}&bottom=${secondArg}`, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        }).then(res => res.buffer());
        const attachment = new MessageAttachment(all, "dym.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Did you mean?")
            .attachFiles(attachment)
            .setImage("attachment://dym.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = Dym;