const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class BanCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "ban",
                aliases: ["banuj", "wypierdalaj", "wypierdol", "zdzbanuj", "b"],
                permissionLevel: 3,
                botPerm: "BAN_MEMBERS"
            },
            help: {
                description: "Banuje użytkownika z serwera",
                usage: "<p>ban <Użytkownik> [Powód]",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"
            }
        });
    }

    async run(message, { args, prefix, flags }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<@Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}ban <@Użytkownik> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika. Użyj komendy \`${prefix}fetch <ID>\` by wprowadzić takiego użytkownika do pamięci.`);
        if (target.id === message.author.id) return sender.warn("Nie możesz sam siebie zbanować. ~~Samookaleczanie jest złe, napewno masz po co żyć.~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz zbanować właściciela serwera.");
        if (target.id === client.user.id) return sender.warn("Ale.. dlaczego? 😣");

        let banned;
        const banList = await message.guild.fetchBans();
        banList.forEach(user => {
            if (user.user?.id === target.id) banned = true;
        });
        if (banned) return sender.warn("Ten użytkownik ma już bana!");


        if (message.guild.members.cache.get(target.id)) {
            const member = await message.guild.member(target);
            if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz zbanować osoby z wyższą, lub równą Tobie rolą.`);
            if (!member.bannable) return sender.warn("Nie posiadam uprawnień aby zbanować tą osobę. Prawdopodobnie posiada wyższą role odemnie.");
        }

        let hide = [];

        let reason = args.slice(1).join(" ");
        if (reason.length <= 0) reason = "Powód nie został podany.";
        if (reason.length > 512) return sender.warn("Powód bana jest zbyt długi. Maksymalna ilośc znaków w powodzie to 512.");
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let wys;
        if (flags.includes("m")) hide.push("mod");
        if (flags.includes("nodm")) hide.push("nodm");
        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "ban", {
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
                .addField("**Akcja:**", "Banowanie użytkownika (ban)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }


        await message.guild.members.ban(target, { reason: `${message.author.tag}: ${reason}` })
            .catch(() => {
                return sender.error("Wystąpił błąd w banowaniu tego użytkownika.");
            });

        await message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            //.setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .addField("**Użytkownik:**", target.user ? target.user.tag + " (`" + target.id + "`)" : target.tag + " (`" + target.id + "`)")
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid)
            .addField("**Info na DM:**", hide.includes("nodm") ? "<:check_red:814098202063405056> Nie wysłano wiadomości na DM." : wys)
            .addField("**Akcja:**", "Banowanie użytkownika (ban)")
            .setColor("RED")
        );

    }
}

module.exports = BanCommand;