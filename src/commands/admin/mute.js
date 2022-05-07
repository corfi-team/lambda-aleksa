const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class MuteCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "mute",
                aliases: ["wycisz", "m"],
                permissionLevel: 3,
                botPerm: "MANAGE_ROLES"
            },
            help: {
                description: "Wycisza użytkownika na serwerze.",
                usage: "<p>mute <Użytkownik> [Powód]",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"
            }
        });
    }

    async run(message, { args, guildConf, prefix, flags }) {
        const sender = new Sender(message);
        const muteRole = message.guild.roles.cache.get(guildConf.mutedRole);

        if (!muteRole) return sender.warn(`Nie znaleziono roli wyciszonych użytkowników. Ustaw ją w [panelu](http://delover.xyz/dashboard/${message.guild.id})`);

        if (!args.length) return sender.warn(`Niepoprawny argument \`<Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}mute <Użytkownik> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika. Użyj komendy \`${prefix}fetch <ID>\` by wprowadzić takiego użytkownika do pamięci.`);
        if (target.id === message.author.id) return sender.warn("Nie możesz sam siebie wyciszyć. ~~Samookaleczanie jest złe, napewno masz po co żyć.~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz wyciszyć właściciela serwera.");
        if (!message.guild.members.cache.get(target.id)) return sender.warn("Tego użytkownika nie ma na tym serwerze");
        const member = await message.guild.member(target);
        if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz wyciszyć osoby z wyższą, lub równą Tobie rolą.`);
        if (!member.kickable) return sender.warn("Nie posiadam uprawnień aby wyciszyć tą osobę. Prawdopodobnie posiada wyższą role odemnie.");

        if (target.id === client.user.id) return sender.warn("Ale.. dlaczego? 😣");

        const userMuted = await client.db.mutes.get(message.guild.id, target.id);
        if (userMuted) return sender.warn(`Ten użytkownik jest wyciszony w naszej bazie danych. Odcisz go komendą \`${prefix}unmute\``);

        let hide = [];
        let reason = args.slice(1).join(" ");
        if (reason.length <= 0) reason = "Powód nie został podany.";
        if (reason.length > 512) return sender.warn("Powód bana jest zbyt długi. Maksymalna ilośc znaków w powodzie to 512.");
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let wys;
        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "mute", {
            created: Date.now(),
            expires: null
        }, hide, true);

        if (!hide.includes("nodm")) {
            await target.send(new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setColor("RED")
                .addField("**Serwer:**", message.guild.name)
                .addField("**Moderator:**", mod)
                .addField("**Powód:**", reason)
                .addField("**Punishment:**", "#" + caseid)
                .addField("**Akcja:**", "Wyciszenie użytkownika (mute)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }

        await member.roles.add(muteRole, `${message.author.tag}: ${reason}`)
            .catch(() => {
                return sender.error("Wystąpił błąd w wyciszaniu tego użytkownika.");
            });
        await client.db.mutes.add(message.guild.id, target.id, message.author.id);

        await message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            //.setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .addField("**Użytkownik:**", target.user ? target.user.tag + " (`" + target.id + "`)" : target.tag + " (`" + target.id + "`)")
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid).addField("**Info na DM:**", hide.includes("nodm") ? "<:check_red:814098202063405056> Nie wysłano wiadomości na DM." : wys)
            .addField("**Akcja:**", "Wyciszenie użytkownika (mute)")
            .setColor("RED")
        );

    }
}

module.exports = MuteCommand;