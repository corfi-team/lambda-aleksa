const { MessageEmbed, MessageAttachment, Util } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class AchievementCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "achievement",
            },
            help: {
                description: "Tworzy obrazek \"achievement get\" z minecrafta",
                category: "Zabawa",
                usage: "<p>achievement <tekst>"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length || args.join(" ").isAscii()) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu widocznego na obrazku lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}achievement <tekst>\``);
        const data = await (await fetch(`https://api.alexflipnote.dev/achievement?text=${encodeURIComponent(Util.cleanContent(args.join(" "), message))}`, { headers: { "Authorization": client.config.tokens.apis.alexflipnote } })).buffer();
        const attachment = new MessageAttachment(data, "achievement.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Achievement")
            .attachFiles(attachment)
            .setImage(`attachment://achievement.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = AchievementCommand;