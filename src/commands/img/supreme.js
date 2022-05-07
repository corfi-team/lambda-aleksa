const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class SupremeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "supreme",
            },
            help: {
                description: "Tworzy obrazek supreme",
                usage: "<p>supreme <tekst>",
                category: "Obrazki",
                flags: "`-dark` - Sprawia ze obrazek jest czarny\n`-light` - Sprawia ze obrazek jest biały"
            }
        });
    }

    async run(message, { args, flags, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstulub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}supreme <tekst>\``);
        let arg = encodeURIComponent(args.join(" "));
        let baseurl = `https://api.alexflipnote.dev/supreme?text=${arg}`;
        if (flags[0] === "dark") baseurl += "&dark=true";
        if (flags[0] === "light") baseurl += "&light=true";

        let all = await fetch(baseurl, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        }).then(res => res.buffer());
        const attachment = new MessageAttachment(all, "supreme.png");

        message.channel.stopTyping(1);
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Supreme")
            .attachFiles(attachment)
            .setImage(`attachment://supreme.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);


        message.reply(embed);

    }
}

module.exports = SupremeCommand;