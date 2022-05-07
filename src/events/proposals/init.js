const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed, Util, Collection } = require("discord.js");
const cooldowns = new Collection();
const Sender = require("../../lib/modules/Sender");

module.exports = class ProposalCreateevent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "proposalCreate",
            }
        });
    }

    async run(message, { guildConf }) {
        const sender = new Sender(message);
        const channels = guildConf.proposals?.channels;
        if (!channels.includes(message.channel.id)) return;
        const cooldownAmount = 2 * 1000;

        if (cooldowns.has(message.author.id)) {
            const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;

            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                const x = await sender.create(`Poczekaj \`${timeLeft.toFixed(1)}s\` przed napisaniem kolejnej propozycji`, "<:check_red:814098202063405056> Poczekaj", "", "RED");
                await x.delete({ timeout: 5000 }).catch(() => {
                });
                await message.delete({ timeout: 5000 }).catch(() => {
                });
                return;
            }
        }

        cooldowns.set(message.author.id, Date.now());
        setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);


        const nick = message.member.nickname || message.author.username;

        await message.guild.webhook.setChannel(message.channel);
        if (message.content.startsWith(guildConf.proposals.comment) && message.member.permissionsLevel > 1) {
            let tts = message.content;
            tts = tts.replace(guildConf.proposals.comment, "");
            tts = Util.cleanContent(tts, message);
            tts = Util.removeMentions(tts);
            const embed = new MessageEmbed()
                .setColor(message.guild.settings.colors.done)
                .setTitle("Komentarz moderacji")
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setDescription(tts)
                .setFooter(`Komentarz: ${guildConf.proposals.comment}<treść>`);
            await message.guild.webhook.send({
                files: message.attachments.map(a => a.url),
                username: nick,
                avatarURL: message.author.displayAvatarURL(ImageURLOptions),
                disableMentions: "all",
                embeds: [embed]
            });
            message.delete({ timeout: 500 }).catch(() => {
            });
        } else if (message.content.startsWith(guildConf.proposals.comment)) {
            let tts = message.content;
            tts = tts.replace(guildConf.proposals.comment, "");
            tts = Util.cleanContent(tts, message);
            tts = Util.removeMentions(tts);
            await message.guild.webhook.send(tts, {
                files: message.attachments.map(a => a.url),
                username: nick,
                avatarURL: message.author.displayAvatarURL(),
                disableMentions: "all"
            });
            message.delete({ timeout: 500 }).catch(() => {
            });
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL(ImageURLOptions))
                .setTitle("Propozycja")
                .setColor("GREEN")
                .setDescription(`${message.content}`)
                .setFooter(`Komentarz: ${guildConf.proposals.comment}<treść>`);
            if (message.attachments.size > 0) embed.setImage(message.attachments.array()[0].proxyURL);
            const msg = await message.guild.webhook.send({
                embeds: [embed],
                username: nick,
                avatarURL: message.author.displayAvatarURL(),
                disableMentions: "all"
            });
            await message.delete({ timeout: 500 }).catch(() => {
            });
            await msg.react("814098229712781313");
            await msg.react("814098094743486468");
            await msg.react("814098202063405056");
        }
    }


};