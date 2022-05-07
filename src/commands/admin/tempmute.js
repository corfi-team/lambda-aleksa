const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const ms = require("../../lib/modules/Ms.js");
const moment = require("moment");
moment.locale("PL");

class BanCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "tempmute",
                aliases: ["czasmorda", "czascicho", "tm"],
                permissionLevel: 3,
                botPerm: "MANAGE_ROLES"
            },
            help: {
                description: "Wycisza użytkownika z serwera na określony czas",
                usage: "<p>tempmute <użytkownik> <czas> [Powód]",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"
            }
        });
    }

    async run(message, { args, guildConf, prefix, flags }) {
        const sender = new Sender(message);

        const muteRole = message.guild.roles.cache.get(guildConf.mutedRole);

        if (!muteRole) return sender.warn(`Nie znaleziono roli wyciszonych użytkowników. Ustaw ją w [panelu](http://delover.xyz/dashboard/${message.guild.id})`);

        if (!args.length) return sender.warn(`Niepoprawny argument \`<@Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}tempmute <@Użytkownik> <czas> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);

        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika. Użyj komendy \`${prefix}fetch <ID>\` by wprowadzić takiego użytkownika do pamięci.`);
        if (target.id === message.author.id) return sender.warn("Nie możesz sam siebie zbanować. ~~Samookaleczanie jest złe, napewno masz po co żyć.~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz zbanować właściciela serwera.");
        if (!message.guild.members.cache.get(target.id)) return sender.warn("Tego użytkownika nie ma na tym serwerze");
        const member = await message.guild.member(target);

        if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz wyciszyć osoby z wyższą, lub równą Tobie rolą.`);
        if (!member.kickable) return sender.warn("Nie posiadam uprawnień aby wyciszyć tą osobę. Prawdopodobnie posiada wyższą role odemnie.");
        if (target.id === client.user.id) return sender.warn("Ale.. dlaczego? 😣");

        if (!args[1]) return sender.warn(`Niepoprawny argument \`<czas>\`\nNie podano czasu\n\nPoprawne użycie: \`${prefix}ban <@Użytkownik> <czas> [Powód]\``);

        const userMuted = await client.db.mutes.get(message.guild.id, target.id);
        if (userMuted) return sender.warn(`Ten użytkownik jest wyciszony w naszej bazie danych. Odcisz go komendą \`${prefix}unmute\``);

        let time = ms(args[1]);
        if (!time) return sender.warn(`Niepoprawny argument \`<czas>\`\nPodano zły czas\n\nPoprawne użycie: \`${prefix}ban <@Użytkownik> <czas> [Powód]\``);
        let reason = args.slice(2).join(" ");
        if (reason.length <= 0) reason = "Powód nie został podany.";
        if (reason.length > 512) return sender.warn("Powód bana jest zbyt długi. Maksymalna ilośc znaków w powodzie to 512.");
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let wys;
        let hide = [];
        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "tempmute", {
            created: Date.now(),
            expires: Date.now() + time
        }, hide, true);

        await target.send(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setColor("RED")
            .addField("**Serwer:**", message.guild.name)
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid)
            .addField("**Zakończy sie**", `${moment(time + Date.now()).fromNow()}`)
            .addField("**Data zakończenia**", `${new Date(time + Date.now()).toLocaleString()}`)
            .addField("**Akcja:**", "Czasowe wyciszenie użytkownika (tempmute)")
        ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
        if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";

        await member.roles.add(muteRole, `${message.author.tag}: ${reason}`)
            .catch(() => {
                return sender.error("Wystąpił błąd w wyciszaniu tego użytkownika.");
            });

        client.db.tempmutes.add(message.guild.id, target.id, message.author.id, {
            created: Date.now(),
            expires: Date.now() + time
        }, true, caseid);

        client.db.mutes.add(message.guild.id, target.id, message.author.id);

        await message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            //.setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .addField("**Użytkownik:**", target.user ? target.user.tag + " (`" + target.id + "`)" : target.tag + " (`" + target.id + "`)")
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid)
            .addField("**Info na DM:**", wys)
            .addField("**Zakończy sie**", `${moment(Date.now() + time).fromNow()}`)
            .addField("**Data zakończenia**", `${new Date(Date.now() + time).toLocaleString()}`)
            .addField("**Akcja:**", "Czasowe wyciszenie użytkownika (tempmute)")
            .setColor("RED")
        );

    }
}

module.exports = BanCommand;