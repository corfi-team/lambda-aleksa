const BaseCommand = require("../../lib/base/BaseCommand");
const { MessageEmbed } = require("discord.js");

class HelpCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "links",
                aliases: ["invite", "support", "linki", "dodaj-bota", "botadd", "addbot", "add-bot", "dodaj", "zapro", "dodajtegowspanialegobota"],
            },
            help: {
                description: "Linki",
                usage: "<p>links",
                category: "Bot",
            }
        });
    }

    async run(message) {

        const embed = new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setDescription("[Serwer Support](https://discord.gg/nE9BtwXVUW) | [Strona](http://delover.xyz) | [Dodanie bota](https://discord.com/api/oauth2/authorize?client_id=814064909313638450&permissions=8&scope=bot%20applications.commands)")
            .setTitle("<:check_green:814098229712781313> Linki");
        message.reply(embed);

    }
}

module.exports = HelpCommand;

