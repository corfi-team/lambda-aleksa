const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class KickCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "kick",
                aliases: ["wyrzuć", "kicknij", "kopnij", "karatekick", "karate-kick", "k"],
                permissionLevel: 3,
                botPerm: "KICK_MEMBERS"
            },
            help: {
                description: "Wyrzuca użytkownika z serwera",
                usage: "<p>kick <Użytkownik> [Powód]",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"

            }
        });
    }

    async run(message, { args, prefix, flags }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}kick <@Użytkownik> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);

        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika. Wprowadź poprawne id użytkownika lub go oznacz.`);
        if (target.id === message.author.id) return sender.warn("Nie możesz sam siebie wyrzucić. ~~Samookaleczanie jest złe, napewno masz po co żyć.~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz wyrzucić właściciela serwera.");
        if (target.id === client.user.id) return sender.warn("Ale.. dlaczego? 😣");

        if (!message.guild.members.cache.get(target.id)) return sender.warn("Tego użytkownika nie ma na tym serwerze");
        const member = await message.guild.member(target);
        if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz wyrzucić osoby z wyższą, lub równą Tobie rolą.`);
        if (!member.kickable) return sender.warn("Nie posiadam uprawnień aby wyrzucić tą osobę. Prawdopodobnie posiada wyższą role odemnie.");
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let reason = args.slice(1).join(" ");
        if (reason.length <= 0) reason = "Nie został podany.";
        if (reason.length > 512) return sender.warn("Powód jest zbyt długi. Maksymalna ilość znaków w powodzie to 512.");

        await member.kick({ reason: `${message.author.tag}: ${reason}` })
            .catch(() => {
                return sender.error("Wystąpił błąd w wyrzucaniu tego użytkownika.");
            });

        let hide = [];
        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "kick", {
            created: Date.now(),
            expires: null
        }, hide, true);


        let wys;

        if (flags.includes("nodm")) hide.push("nodm");


        if (!hide.includes("nodm")) {
            await target.send(new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setColor("RED")
                .addField("**Serwer:**", message.guild.name)
                .addField("**Moderator:**", mod)
                .addField("**Powód:**", reason)
                .addField("**Punishment:**", `#${caseid}`)
                .addField("**Akcja:**", "Wyrzucanie użytkownika (kick)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }

        await message.reply(new MessageEmbed()
            .setFooter(client.footer, client.user.displayAvatarURL())
            //.setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .addField("**Użytkownik:**", target.user ? target.user.tag + " (`" + target.id + "`)" : target.tag + " (`" + target.id + "`)")
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", `#${caseid}`)
            .addField("**Info na DM:**", wys)
            .addField("**Akcja:**", "Wyrzucanie użytkownika (kick)")
            .setColor("RED")
        );

    }
}

module.exports = KickCommand;