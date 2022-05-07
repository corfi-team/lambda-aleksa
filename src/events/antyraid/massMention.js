const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
const Sender = require("../../lib/modules/Sender");

module.exports = class antyRaidEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "massMention",
            }
        });
    }

    async run(message, { guildConf }) {
        if (message.author.bot) return;
        // if (message.member.permissionsLevel >= 3) return true;
        const sender = new Sender(message);
        const muteRole = message.guild.roles.cache.get(guildConf.mutedRole);
        // if (!guildConf.antyraid.actions.mention.status) return;
        if (message.mentions.members.size + message.mentions.roles.size >= 3) {
            let caseid;
            const reason = `Akcja podjęta przez system anty-raid, a dokładniej zabezpieczenie przed mass-pingiem.`;
            if (guildConf.antyraid?.actions?.mention === "tempmute") {
                await message.member.roles.add(muteRole, reason).catch(() => {
                    return sender.error("Wystąpił błąd w wyciszaniu tego użytkownika.");
                });

                caseid = await (await client.db.punishments.create(message.guild.id, message.author.id, client.user.id, reason, "tempmute", {
                    created: Date.now(),
                    expires: Date.now() + 900000
                }, [], true)).caseid;
            } else if (guildConf.antyraid?.actions?.mention === "warn") {
                caseid = await (await client.db.punishments.create(message.guild.id, message.author.id, client.user.id, reason, "warn", {
                    created: Date.now(),
                    expires: null
                }, [], true)).caseid;
            } else if (guildConf.antyraid?.actions?.mention === "tempban") {
                caseid = await (await client.db.punishments.create(message.guild.id, message.author.id, client.user.id, reason, "tempban", {
                    created: Date.now(),
                    expires: Date.now() + 900000
                }, [], true)).caseid;

                await message.guild.members.ban(message.author.id, { reason: `${client.user.tag}: ${reason}` }).catch(() => {
                    return sender.error("Wystąpił błąd w banowaniu tego użytkownika.");
                });
            } else if (guildConf.antyraid?.actions?.mention === "ban") {
                caseid = await (await client.db.punishments.create(message.guild.id, message.author.id, client.user.id, reason, "ban", {
                    created: Date.now(),
                    expires: null
                }, [], true)).caseid;

                await message.guild.members.ban(message.author.id, { reason: `${client.user.tag}: ${reason}` }).catch(() => {
                    return sender.error("Wystąpił błąd w banowaniu tego użytkownika.");
                });
            } else if (guildConf.antyraid?.actions?.mention === "kick") {
                caseid = await (await client.db.punishments.create(message.guild.id, message.author.id, client.user.id, reason, "kick", {
                    created: Date.now(),
                    expires: null
                }, [], true)).caseid;

                await message.member.kick(client.user.tag + ": " + reason).catch(() => {
                    return sender.error("Wystąpił błąd w wyrzucaniu tego użytkownika.");
                });
            }

            message.reply(new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setDescription(`**${message.author.tag}**, mass ping nie będzie tolerowany, podjąłem ustawione przez administrację kroki. **(\`${guildConf.antyraid?.actions?.mention || "Brak akcji"}\`)**`)
                .setColor(guildConf?.colors?.warn)
                .setFooter(`Case: #${caseid} || ${guildConf.prefixes[0]}config antyraid || Ta wiadomość zniknie za 7 sekund.`, client.user.displayAvatarURL(ImageURLOptions))
            ).then((msg) => msg.delete({ timeout: 7500 }));
            message.delete();
        }
    };
};