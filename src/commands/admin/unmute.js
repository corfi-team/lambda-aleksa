const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class UnmuteCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "unmute",
                aliases: ["odwycisz", "um"],
                permissionLevel: 3,
                botPerm: "MANAGE_ROLES"
            },
            help: {
                description: "Anuluje wyciszenie użytkownika",
                usage: "<p>unmute <Użytkownik>",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"
            }
        });
    }

    async run(message, { args, guildConf, prefix, flags }) {
        const sender = new Sender(message);
        const muteRole = message.guild.roles.cache.get(guildConf.mutedRole);

        if (!muteRole) return sender.warn(`Nie znaleziono roli wyciszonych użytkowników. Ustaw ją w [panelu](http://delover.xyz/dashboard/${message.guild.id})`);

        if (!args.length) return sender.warn(`Niepoprawny argument \`<Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}unmute <Użytkownik> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika.`);
        if (target.id === message.author.id) return sender.warn("Nie możesz sam siebie odciszyć. ~~Nie możesz sam sobie pomóc~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz wyciszyć właściciela serwera.");
        if (!message.guild.members.cache.get(target.id)) return sender.warn("Tego użytkownika nie ma na tym serwerze");
        const member = await message.guild.member(target);
        if (!member.kickable) return sender.warn("Nie posiadam uprawnień aby odciszyć tą osobę. Prawdopodobnie posiada wyższą role odemnie.");
        if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz odciszyć osoby z wyższą, lub równą Tobie rolą.`);

        const userMuted = await client.db.mutes.get(message.guild.id, target.id);
        if (!userMuted) return sender.warn(`Ten użytkownik nie jest wyciszony w naszej bazie danych.`);

        let hide = [];
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Powód nie został podany.";
        if (reason.length > 512) return sender.warn("Powód bana jest zbyt długi. Maksymalna ilośc znaków w powodzie to 512.");
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let wys;
        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "unmute", {
            created: Date.now(),
            expires: null
        }, hide, true);

        if (!flags.includes("nodm")) {
            await target.send(new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setColor("GREEN")
                .addField("**Serwer:**", message.guild.name)
                .addField("**Moderator:**", mod)
                .addField("**Powód:**", reason)
                .addField("**Punishment:**", "#" + caseid)
                .addField("**Akcja:**", "Odciszenie użytkownika (unmute)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }

        await member.roles.remove(muteRole, `${message.author.tag}: ${reason}`)
            .catch(() => {
                return sender.error("Wystąpił błąd w wyciszaniu tego użytkownika.");
            });
        await client.db.mutes.remove(message.guild.id, target.id);

        await message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            //.setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .addField("**Użytkownik:**", target.user ? target.user.tag + " (`" + target.id + "`)" : target.tag + " (`" + target.id + "`)")
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid)
            .addField("**Info na DM:**", flags.includes("nodm") ? "<:check_red:814098202063405056> Nie wysłano wiadomości na DM." : wys)
            .addField("**Akcja:**", "Odciszenie użytkownika (unmute)")
            .setColor("GREEN")
        );

    }
}

module.exports = UnmuteCommand;