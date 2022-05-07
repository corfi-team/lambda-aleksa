const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed, Util, Collection } = require("discord.js");
const cooldowns = new Collection();
const Sender = require("../../lib/modules/Sender");
const r = require("rethinkdb");
//TODO: database class

module.exports = class ProposalCreateevent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "memeInit",
            }
        });
    }

    async run(message, { guildConf }) {
        const sender = new Sender(message);
        if (message.channel.id !== /*guildConf.memes?.channelID*/"826433213596434453") return;
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
        if (message.content.startsWith(/*guildConf.memes.comment*/"%")) {
            let tts = message.content;
            tts = tts.replace(/*guildConf.memes.comment*/ "%", "");
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
            const memeid = (await r.table("Memes").getAll([message.guild.id], { index: "getAll" }).coerceTo("array").run(client.db.conn)).length + 1;
            const embed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL(ImageURLOptions))
                .setTitle("Użyj: " + guildConf.prefixes[0] + "help meme")
                .setColor("GREEN")
                .setDescription(`${message.content}`)
                .setFooter(`Komentarz: ${guildConf.memes?.comment || "%"}<treść> || Meme ID: #${memeid || "Nie znaleziono."}`);
            if (message.attachments.size > 0) embed.setImage(message.attachments.array()[0].proxyURL);
            const msg = await message.guild.webhook.send({
                embeds: [embed],
                username: nick,
                avatarURL: message.author.displayAvatarURL(),
                disableMentions: "all"
            });
            await message.delete({ timeout: 500 }).catch(() => {
            });

            await r.table("Memes").insert({
                attachment: message.attachments.array()[0]?.proxyURL || "Brak obrazka.",
                message: [message.content, message.id],
                userid: message.author.id,
                guildid: message.guild.id,
                memeid: memeid,
                deleted: false
            }).run(client.db.conn);

            msg.react(guildConf.memes?.likeReact || "👍");
            await msg.react(guildConf.memes?.disslikeReact || "👎");
        }
    }
};