const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class VerifyCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "verify",
            },
            help: {
                description: "Weryfikuje uzytkownika",
                usage: "<p>verify",
                category: "Inne"
            }
        });
    }


    async run(message, { guildConf }) {
        const sender = new Sender(message);
        if (!guildConf.verification?.status || !guildConf.verification?.channel || !guildConf.verification?.roles?.add) return sender.warn("Weryfikacja jest wyłączona na tym serwerze lub jest niepoprawnie ustawiona");

        const logsChannel = client.channels.cache.get(guildConf.verification?.logs);

        if (guildConf.verification.minTime && guildConf.verification.minTime) {
            const time = new Date(Date.parse(message.author.createdAt));
            if (time > Date.now() - guildConf.verification.minTime / 1000) return sender.warn(`Twoje konto jest założone mniej niż ustawiony czas przez administora serwera, wiec jest niezdolne do weryfikacji!`);
        }

        if (message.channel.id !== guildConf.verification.channel) return sender.warn(`Tej komendy możesz użyć tylko na <#${guildConf.verification.channel}>`);


        if (message.member.roles.cache.has(guildConf.verification.roles.add)) return sender.warn(`Posiadasz już role <@&${guildConf.verification.roles.add}>`);

        message.channel.startTyping(1);
        const body = await fetch("http://api.aleks1123.xyz/util/captcha").then(r => r.json());
        message.channel.stopTyping(1);
        const attachment = new MessageAttachment(Buffer.from(body.image.base64, "base64"), "captcha.png");

        const embed = new MessageEmbed()
            .setTitle("<a:protection:717335658238050334> Weryfikacja")
            .attachFiles(attachment)
            .setDescription(`Przepisz kod z obrazka by otrzymać role <@&${guildConf.verification.roles.add}>. Kod musi być identyczny, musi zostać napisany dużymi literami. Masz 30 sekund`)
            .setColor("GREEN")
            .setImage("attachment://captcha.png")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        const msg = await message.reply(embed);


        const collected = await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {
            max: 1, time: 15000
        });

        if (!collected.first()) {
            msg.delete({ timeout: 500 });
            const embedFalse = new MessageEmbed()
                .setTitle("<a:protection:717335658238050334> Weryfikacja")
                .setDescription(`Nie zdażyłeś przepisac kodu w okreslonym czasie. Spróbuj ponownie`)
                .setColor("RED")
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            message.reply(embedFalse).then(x => x.delete({ timeout: 5000 })).catch(() => {
            });
            message.delete({ timeout: 5000 }).catch(() => {
            });
            if (logsChannel) {
                const embedLogs = new MessageEmbed()
                    .setTitle("<a:protection:717335658238050334> Weryfikacja")
                    .setDescription(`Użytkownik ${message.author} nie przeszedł weryfikacji, ponieważ nie przepisał kodu w określonym czasie`)
                    .setColor("RED")
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
                logsChannel.send(embedLogs);
            }
            return;
        }
        const msgrecived = collected.first();
        msg.delete({ timeout: 500 });

        if (msgrecived.content === body.code) {
            const embedTrue = new MessageEmbed()
                .setTitle("<a:protection:717335658238050334> Weryfikacja")
                .setDescription(`Kod został poprawnie przepisany, otrzymałeś/aś role <@&${guildConf.verification.roles.add}>`)
                .setColor("GREEN")
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            message.reply(embedTrue).then(x => x.delete({ timeout: 5000 })).catch(() => {
            });
            message.delete({ timeout: 5000 }).catch(() => {
            });
            msgrecived.delete().catch(() => {
            });

            message.member.roles.add(guildConf.verification.roles.add).catch(() => {
            });
            message.member.roles.remove(guildConf.verification.roles.remove).catch(() => {
            });

            const messages = await message.channel.messages.fetch({ limit: 100 });
            const msgverify = messages.find(x => x.author?.id === client.user.id && x.embeds.length && x.embeds[0]?.footer?.text === `Weryfikacja | ${message.author.id}`);

            if (msgverify) msgverify.delete({ timeout: 500 }).catch(() => {
            });

            if (logsChannel) {
                const embedLogs = new MessageEmbed()
                    .setTitle("<a:protection:717335658238050334> Weryfikacja")
                    .setDescription(`Użytkownik ${message.author} przeszedł poprawnie weryfikacje`)
                    .setColor("GREEN")
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
                logsChannel.send(embedLogs);
            }

        } else {
            const embedFalse = new MessageEmbed()
                .setTitle("<a:protection:717335658238050334> Weryfikacja")
                .setDescription(`Nie przepisałeś poprawnie kodu, spróbuj ponownie`)
                .setColor("RED")
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            message.reply(embedFalse).then(x => x.delete({ timeout: 5000 })).catch(() => {
            });
            message.delete({ timeout: 5000 }).catch(() => {
            });
            msgrecived.delete().catch(() => {
            });

            if (logsChannel) {
                const embedLogs = new MessageEmbed()
                    .setTitle("<a:protection:717335658238050334> Weryfikacja")
                    .setDescription(`Użytkownik ${message.author} nie przeszedł weryfikacji, ponieważ nie przepisał poprawnego kodu`)
                    .setColor("RED")
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
                logsChannel.send(embedLogs);
            }
        }


    }
}

module.exports = VerifyCommand;