const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const punishmentTypes = {
    ban: "BAN",
    warn: "WARN",
    kick: "KICK",
    tempmute: "TEMPMUTE",
    tempban: "TEMPBAN",
    mute: "MUTE",
    unmute: "UNMUTE",
    unban: "UNBAN"
};

class PunishmentCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "punishment",
                aliases: ["punish", "case"],
            },
            help: {
                description: "Wyświetla punishment o podanym numerze.",
                usage: "<p>punishment <Numer>",
                category: "Administracyjne",
                flags: "`-admin` - Pokazuje informacje przydatne dla administracji"
            }
        });
    }

    async run(message, { args, prefix, flags }) {
        const sender = new Sender(message);
        const number = args[0];

        if (!number || !parseInt(number)) return sender.warn(`Nie poprawny argument \`<numer>\`\nNie podano numeru kary\n\nPoprawne użycie: \`${prefix}punishment <numer>\``);

        const punish = await client.db.punishments.get(message.guild.id, parseInt(number));
        if (!punish) return sender.warn(`Nie poprawny argument \`<numer>\`\nNie znaleziono takiej kary\n\nPoprawne użycie: \`${prefix}punishment <numer>\``);

        await client.users.fetch(punish.moderatorid).catch(() => {
            return false;
        });
        await client.users.fetch(punish.userid).catch(() => {
            return false;
        });
        //TODO: autofetch here
        const mod = punish.hide.includes("mod") ? {
            tag: "[Ukryto]",
            id: "[Ukryto]"
        } : await client.users.cache.get(punish.moderatorid) || { tag: "Nie znaleziono", id: "Nie znaleziono" };
        const user = await client.users.cache.get(punish.userid) || { tag: "Nie znaleziono", id: "Nie znaleziono" };
        const delmod = punish.deleted && punish.deleted.moderatorid ? await client.users.cache.get(punish.deleted.moderatorid) || {
            tag: "Nie znaleziono",
            id: "Nie znaleziono"
        } : null;
        if (flags.includes("admin") || flags.includes("a")) {
            if (message.member.permissionsLevel < 3) return sender.error("Nie możesz użyc flagi `-admin` nie bedac administratorem");
            const desc = `**Użytkownik**: ${user.tag} (\`${user.id}\`)\n**Moderator**: ${mod.tag} (\`${mod.id}\`)\n**Powód**: \`${punish.reason}\`\n**Data nadania**: \`${new Date(punish.date?.created).toLocaleString()}\`${punish.date?.expires ? `\n**Data zakończenia**: \`${new Date(punish.date?.expires).toLocaleString()}\`\n\n**Usunięte**: \`${punish.deleted?.status ? "Tak" : "Nie"}\`${punish.deleted?.status ? `\n**Usuniete przez**: ${delmod.tag} (\`${delmod.id}\`)` : ""}` : ""}`;
            //if (punish.deleted) return sender.warn("Ten punishment jest usuniety")
            const embed = new MessageEmbed()
                .setTitle(`<:check_green:814098229712781313> **[\`${punishmentTypes[punish.type]}\`]** Punishment ${punish.caseid}`)
                .setColor(message.guild.settings?.colors?.done)
                .setDescription(desc)
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setFooter(client.footer, client.user.displayAvatarURL());

            message.reply(embed);
            return;
        }
        const desc = `**Użytkownik**: ${user.tag} (\`${user.id}\`)\n**Moderator**: ${mod.tag} (\`${mod.id}\`)\n**Powód**: \`${punish.reason}\`\n**Data nadania**: \`${new Date(punish.date?.created).toLocaleString()}\`${punish.date?.expires ? `\n**Data zakończenia**: \`${new Date(punish.date?.expires).toLocaleString()}\`` : ""}`;
        if (punish.deleted?.status) return sender.warn("Ten punishment jest usuniety");
        const embed = new MessageEmbed()
            .setTitle(`<:check_green:814098229712781313> **[\`${punishmentTypes[punish.type]}\`]** Punishment ${punish.caseid}`)
            .setColor(message.guild.settings?.colors?.done)
            .setDescription(desc)
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setFooter(client.footer, client.user.displayAvatarURL());

        message.reply(embed);
    }
}

module.exports = PunishmentCommand;