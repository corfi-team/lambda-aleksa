const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class WarnCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "warn",
                aliases: ["warning", "ostrzez", "ostrzeż", "w"],
                permissionLevel: 2
            },
            help: {
                description: "Nadaje ostrzeżenie użytkownikowi",
                usage: "<p>warn <Użytkownik> [Powód]",
                category: "Administracyjne",
                flags: "`-nodm` - Nie wysyła wiadomości do użytkownika\n`-m` - Ukrywa moderatora"
            }
        });
    }

    async run(message, { args, flags, prefix }) {
        const sender = new Sender(message);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!target) return sender.warn(`Niepoprawny argument \`<@Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}warn <@Użytkownik> [Powód]\``);
        if (target.id === message.author.id) return sender.warn("Nie możesz ostrzec sam siebie!\n~~ssamookaleczenie jest złe~~");
        if (target.id === message.guild.ownerID) return sender.warn("Nie możesz ostrzec właściciela serwera.");
        if (!message.guild.members.cache.get(target.id)) return sender.warn("Tego użytkownika nie ma na tym serwerze");
        if (target.id === client.user.id) return sender.warn("Ale.. dlaczego? 😣");
        const member = await message.guild.member(target);
        if (message.guild.ownerID !== message.author.id && message.member.roles.highest.position <= member.roles.highest.position) return sender.warn(`Nie mozesz zbanować osoby z wyższą, lub równą Tobie rolą.`);

        let reason = args.slice(1).join(" ");
        if (reason && reason.length > 512) return sender.warn("Twój powód jest za długi! Maksymalna długość to 512 znaków.");
        if (!reason) reason = "Nie został podany.";
        let mod = `${message.author.tag} (\`${message.author.id}\`)`;
        if (flags.includes("m")) mod = "[Ukryto]";
        let hide = [];
        if (flags.includes("nodm")) hide.push("nodm");
        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "warn", {
            created: Date.now(),
            expires: null
        }, hide, true);

        let wys;

        if (!hide.includes("nodm")) {
            await target.send(new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setColor("RED")
                .addField("**Serwer:**", message.guild.name)
                .addField("**Moderator:**", mod)
                .addField("**Powód:**", reason)
                .addField("**Punishment:**", "#" + caseid)
                .addField("**Akcja:**", "Ostrzeżenie użytkownika (warn)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }

        message.reply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .addField("**Moderator:**", mod)
            .addField("**Powód:**", reason)
            .addField("**Punishment:**", "#" + caseid)
            .addField("**Info na DM:**", hide.includes("nodm") ? "<:check_red:814098202063405056> Nie wysłano wiadomości na DM." : wys)
            .addField("**Akcja:**", "Ostrzeżenie użytkownika (warn)")
            .setFooter(client.footer, client.user.displayAvatarURL())
        );
    }
}

module.exports = WarnCommand;