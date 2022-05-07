const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed } = require("discord.js");

class SnipeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "snipe",
                aliases: ["odkasuj"],
            },
            help: {
                description: "(　-_･) ︻デ═一 ▸    usunięta wiadomość",
                usage: "<p>snipe",
                category: "Tools",
            }
        });
    }

    async run(message, args) {
        const sender = new Sender(message);
        const snipes = client.snipes.get(message.channel.id) || [];
        const msg = snipes[args[0] - 1 || 0];
        if (!msg) return sender.error("Nie znaleziono usunietych wiadomosci!", "Błąd!");

        message.guild.webhook.setChannel(message.channel.id);

        await message.guild.webhook.send({
            username: message.author.tag,
            avatarURL: message.author.displayAvatarURL(),
            disableMentions: "all",
            content: msg.content + msg.image || ""
        }).catch(() => {
        });
    }
}

module.exports = SnipeCommand;