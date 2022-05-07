const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class ClapCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "clap",
                aliases: ["klap"],
            },
            help: {
                description: "Dodaje emotkę :clap: między spacjami.",
                usage: "<p>clap <tekst>",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);

        if (!args.length) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu\n\nPoprawne użycie: \`${prefix}clap <tekst>\``);

        if (!args[1]) return sender.warn("Oczekiwano przynajmniej 2 słów.");


        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setDescription(args.join("👏").toRandomCase())
        );
    }
}

module.exports = ClapCommand;