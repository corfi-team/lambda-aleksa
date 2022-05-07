const BaseCommand = require("../../lib/base/BaseCommand");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class KrastiCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "crusty",
                aliases: ["krasti", "ściek"],
                permissionLevel: 6
            },
            help: {
                description: "Wysyła gówno, dosłownie.",
                usage: "<p>crusty",
                category: "Prywatne",
            }
        });
    }

    async run(message) {
        const data = await (await fetch("https://api.sparfy.eu/crusty")).json();
        message.reply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setTitle("cRuSty zNoWu siĘ wYjEbał")
            .setColor(message.guild.settings?.colors?.done)
            .addField("**Serwery**", data?.guilds)
            .addField("**Reklamy**", data?.ads)
            .addField("**Gbany**", data?.gbans)
            .addField("**Premium**", data?.premiumGuilds)
            .addField("**Shardy**", data?.shards?.map((s) => `SHARD [${s.shardID}]:\nUptime: **${s.uptime.hours}h ${s.uptime.minutes}m**\nPing: **${s.ping}ms**\nStatus: **${s.status}**`))
        );

    }
}

module.exports = KrastiCommand;