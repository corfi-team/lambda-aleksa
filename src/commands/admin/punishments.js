const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const ReactionPageMenu = require("../../lib/modules/ReactionPageMenu");
const moment = require("moment");
moment.locale("PL");
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
let perms = {
    1: "1: Użytkownik",
    2: "2: Moderator",
    3: "3: Administator",
    4: "4: Właściciel serwera",
    5: "5: Developer bota"
};

class PunishmentCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "punishments",
                aliases: ["bans", "warns", "kicks", "history"],
            },
            help: {
                description: "Wyswietla wszystkie punishmenty danego użytkownika.",
                usage: "<p>punishments <Użytkownik>",
                category: "Administracyjne",
            }
        });
    }

    async run(message, { args }) {
        const sender = new Sender(message);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
        if (target.id !== message.author.id && message.member.permissionsLevel <= 1) return sender.create(`Nie posiadasz uprawnień do sprawdzania kar innych użytowników.\nWymagane uprawnienia: \`2: Moderator\`\nTwoje uprawnienia: \`${perms[message.member.permissionsLevel]}\``, "<:check_red:814098202063405056> Nie posiadasz wystarczających permisji!", "", "RED");
        const punishments = await client.db.punishments.history(message.guild.id, target.id);

        const formatedPunishments = punishments.filter(x => !x.deleted?.status);

        if (!formatedPunishments.length) return sender.warn(`Użytkownik ${target.username} nie posiada punishmentów.`);

        let warns = 0;
        let bans = 0;
        let kicks = 0;
        let mutes = 0;
        let tempmutes = 0;
        let tempbans = 0;
        let unmutes = 0;
        let unbans = 0;
        for (const i of formatedPunishments) {
            switch (i.type) {
                case "warn":
                    warns++;
                    break;
                case "ban":
                    bans++;
                    break;
                case "kick":
                    kicks++;
                    break;
                case "mute":
                    mutes++;
                    break;
                case "tempmute":
                    tempmutes++;
                    break;
                case "tempban":
                    tempbans++;
                    break;
                case "unmute":
                    unmutes++;
                    break;
                case "unban":
                    unbans++;
                    break;
            }
        }


        const userPunishments = formatedPunishments.reverse().chunk(5);
        const defaultEmbed = new MessageEmbed()
            .setTitle("<:check_green:814098229712781313> Kary")
            .setDescription(`Użytkownik: ${target}\n\nIlość warnów: \`${warns}\`\nIlość banów: \`${bans}\`\nIlość kicków: \`${kicks}\`\nIlość wyciszeń: \`${mutes}\`\nIlość czasowych wyciszeń: \`${tempmutes}\`\nIlość czasowych banów\`${tempbans}\n\`Ilość unbanów: \`${unbans}\`\nIlość odciszeń: \`${unmutes}\`\n\nPrzewiń strzałkami by podejrzeć kary`)
            .setColor(message.guild.settings?.colors?.done)
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setFooter(client.footer, client.user.displayAvatarURL());
        const embeds = [defaultEmbed];
        for (const arr of userPunishments) {
            const embed = new MessageEmbed()
                .setTitle("<:check_green:814098229712781313> Kary")
                .setColor(message.guild.settings?.colors?.done)
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setFooter(client.footer, client.user.displayAvatarURL());
            for (const punish of arr) {
                let mod = await client.users.fetch(punish.moderatorid) || {
                    tag: "Nie znaleziono",
                    id: "Nie znaleziono"
                };
                if (punish?.hide?.includes("mod")) mod = "[Ukryto]";
                const desc = `**Moderator**: ${mod.tag} (\`${mod.id}\`)\n**Powód**: \`${punish.reason}\`\n**Data nadania**: \`${new Date(punish.date?.created).toLocaleString()}\`${punish.date?.expires ? `\n**Data zakończenia**: \`${new Date(punish.date?.expires).toLocaleString()}\`` : ""}`;
                const title = `**[\`${punishmentTypes[punish.type]}\`]** Punishment #${punish.caseid}`;
                embed.addField(title, desc);
            }
            embeds.push(embed);

        }
        new ReactionPageMenu({
            channel: message.channel,
            pages: embeds,
            userID: message.author.id,
            message: message
        });
    }
}

module.exports = PunishmentCommand;