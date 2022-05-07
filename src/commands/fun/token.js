const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");

class TokenCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "token",
                aliases: ["bottoken", "bot-token"],
            },
            help: {
                description: "Wysyła randomowy token bota.",
                usage: "<p>token",
                category: "Zabawa",
            }
        });
    }

    async run(message) {
        //const sender = new Sender(message)
        const data = await (await fetch("https://some-random-api.ml/bottoken")).json();

        message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setDescription(`\`\`\`yaml\n${data.token}\`\`\``)
        );
    }
}

module.exports = TokenCommand;