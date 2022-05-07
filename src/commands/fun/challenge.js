const { MessageEmbed, MessageAttachment, Util } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");


class ChallengeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "challenge",
            },
            help: {
                description: "Tworzy obrazek \"challenge complete\" z minecrafta",
                usage: "<p>challenge <tekst>",
                category: "Zabawa"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu\n\nPoprawne użycie: \`${prefix}challenge <tekst>\``);
        const all = await fetch(`https://api.alexflipnote.dev/challenge?text=${encodeURIComponent(Util.cleanContent(args.join(" "), message))}`, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        }).then(res => res.buffer());
        const attachment = new MessageAttachment(all, "challenge.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Challenge complete")
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .attachFiles(attachment)
            .setImage("attachment://challenge.png");
        message.reply(embed);

    }
}

module.exports = ChallengeCommand;