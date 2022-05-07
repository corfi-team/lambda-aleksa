const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class AvatarCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "discordjs",
                aliases: ["djs"],
            },
            help: {
                description: "Wysuzkuje daną klase/property w djs docs",
                usage: "<p>discordjs <fraza>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const search = args.join(" ").replaceAll("#", ".");
        if (!search) return sender.warn(`Niepoprawny argument \`<fraza>\`\nNie podano frazy do wyszukania\n\nPoprawne użycie: \`${prefix}discordjs <fraza>\``);
        const version = args[1] || "stable";

        const body = await fetch(`https://djsdocs.sorta.moe/v1/main/${version}/embed?q=${search}`)
            .then(res => res.json());

        if (body.status === 404) return sender.warn(`Niepoprawny argument \`<fraza>\`\nNie znaleziono funkcji odpowiadającej frazie\n\nPoprawne użycie: \`${prefix}discordjs <fraza>\``);
        const embed = new MessageEmbed(body)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings.colors.done);
        message.reply(embed);
    }
}

module.exports = AvatarCommand;