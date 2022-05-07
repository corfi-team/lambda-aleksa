const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const canvacord = require("canvacord");

class RankCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "rank",
            },
            help: {
                description: "Sprawdza poziom użytkownika",
                usage: "<p>rank <user>",
                category: "Poziomy"
            }
        });
    }

    async run(message, { args, guildConf }) {
        const sender = new Sender(message);
        if (!guildConf.leveling?.status) return sender.warn("System poziomów jest wyłączony!");
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;

        if (member.bot) return sender.warn("Nie możesz sprawdzić poziomu bota, bo go nie ma. No kto by sie spodziewał?");

        const userData = await client.db.leveling.get(message.guild.id, member.id);
        const rankData = await client.db.leveling.getAll(message.guild.id);
        const ranks = rankData.find(n => n.userid === member.id);

        const rank = new canvacord.Rank()
            .setAvatar(member.displayAvatarURL().replace(".gif", ".jpg").replace(".webp", ".jpg"))
            .setCurrentXP(userData.xp ? userData.xp : 0)
            .setRequiredXP(userData.level === 0 ? 150 : (guildConf.leveling.xpNeeded * userData.level))
            .setLevel(userData.level ? userData.level : 0)
            .setStatus(member.presence.status)
            .setProgressBar("BLUE")
            .setUsername(member.username)
            .setDiscriminator(member.discriminator)
            .setBackground("IMAGE", "https://cdn.mee6.xyz/plugins/levels/cards/backgrounds/da3c529f-15c4-4152-8a43-2b401fd93124.jpg")
            .setRank(rankData.indexOf(ranks) + 1);
        message.channel.startTyping(1);
        const data = await rank.build();
        message.channel.stopTyping(1);
        const attachment = new MessageAttachment(data, "rank.png");
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Rank")
            .attachFiles(attachment)
            .setImage("attachment://rank.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

        message.reply(embed);

    }
}

module.exports = RankCommand;