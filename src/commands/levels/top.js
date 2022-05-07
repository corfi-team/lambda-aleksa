const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const ReactionPageMenu = require("../../lib/modules/ReactionPageMenu");

class RankCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "top",
            },
            help: {
                description: "Pokazuje topke poziomów",
                usage: "<p>top",
                category: "Poziomy"
            }
        });
    }

    async run(message, { guildConf }) {

        const sender = new Sender(message);
        if (!guildConf.leveling?.status) return sender.warn("System poziomów jest wyłączony!");

        const top = await client.db.leveling.getAll(message.guild.id);
        if (!top.length) return sender.warn("na tym serwerze nie ma topki!");
        const embeds = [];
        const formatedTop = top.chunk(10);
        let int = 0;
        for (const smallTop of formatedTop) {
            let text = "";
            const embed = new MessageEmbed()
                .setTitle("Top poziomów")
                .setURL(`https://delover.xyz/leaderboard/${message.guild.id}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setColor("GREEN");
            for (const user of smallTop) {
                const mem = await client.users.fetch(user.userid).catch(() => {
                });
                int++;
                text += `\`${int}.\` <@${mem.id}> \`${user.level}\`\ (\`${user.xp}\` \\ \`${(user.level === 0 ? 150 : (guildConf.leveling.xpNeeded * user.level))}\`)\n\n`;
            }
            embed.setDescription(text);
            embeds.push(embed);
        }

        new ReactionPageMenu({
            channel: message.channel,
            userID: message.author.id,
            pages: embeds,
            message: message,
        });

    }
}

module.exports = RankCommand;