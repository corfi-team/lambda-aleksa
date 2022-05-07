const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");
const { MessageEmbed, MessageAttachment } = require("discord.js");

class CaptchaCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "captcha",
            },
            help: {
                description: "Tworzy twoja własna captche",
                usage: "<p>captcha <tekst>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}catpcha <tekst>\``);

        let captchaurl = args.join(" ");
        captchaurl = encodeURIComponent(captchaurl);
        const all = await fetch(`https://api.alexflipnote.dev/captcha?text=${captchaurl}`, {
            method: "GET",
            headers: { "Authorization": client.config.tokens.apis.alexflipnote },
        }).then(res => res.buffer());
        const attachment = new MessageAttachment(all, "captcha.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Captcha")
            .attachFiles(attachment)
            .setImage(`attachment://captcha.png`)
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);

    }
}

module.exports = CaptchaCommand;