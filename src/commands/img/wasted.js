const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

class WastedCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "wasted",
            },
            help: {
                description: "Naklada filtr wasted z gta na avatar użytkownika",
                usage: "<p>wasted <user>",
                category: "Obrazki"
            }
        });
    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        const displayAvatarURL = member.displayAvatarURL(ImageURLOptions).replace(".webp", ".png").replace(".gif", ".png").replace("?size=1024", "");

        const attachment = new MessageAttachment(`https://some-random-api.ml/canvas/wasted?avatar=${displayAvatarURL}`, "wasted.png");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Wasted")
            .attachFiles(attachment)
            .setImage(`attachment://wasted.png`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = WastedCommand;