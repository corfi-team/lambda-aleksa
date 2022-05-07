const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class GayCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "glass",
                aliases: ["szklo", "szkło", "płaczek-jebany"],
            },
            help: {
                description: "Robi z kogoś geja ( ͡° ͜ʖ ͡°)",
                usage: "<p>gay <Użytkownik>",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const mentioned = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
        if (!mentioned) return sender.warn(`Nie znaleziono takiego użytkownika. Użyj komendy \`${prefix}fetch <ID>\` by wprowadzić takiego użytkownika do pamięci.`);
        const link = `https://some-random-api.ml/canvas/glass/?avatar=${mentioned.displayAvatarURL({ format: "png" })}`;

        const attachment = new MessageAttachment(link, "glass.png");

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .attachFiles(attachment)
            .setImage("attachment://glass.png")
        );
    }
}

module.exports = GayCommand;