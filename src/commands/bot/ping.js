const BaseCommand = require("../../lib/base/BaseCommand");
const { MessageEmbed } = require("discord.js");

class PingCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "ping",
                aliases: ["pong", "latency"],
            },
            help: {
                description: "Ping command",
                usage: "<p>ping",
                category: "Bot",
            }
        });
    }

    async run(message) {
        message.reply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> Ping`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setDescription(`**\`\`\`${client.ws.shards.map((s) => `SHARD [${s.id}]: ${s.ping}ms`)}\`\`\`**`)
        );
    }
}

module.exports = PingCommand;