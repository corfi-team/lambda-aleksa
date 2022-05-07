const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed } = require("discord.js");

class UnBanCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "unban",
                aliases: ["odbanuj", "ub"],
                permissionLevel: 3,
                botPerm: "BAN_MEMBERS"
            },
            help: {
                description: "Odbanowywuje użytkownika.",
                usage: "<p>unban <@Użytkownik> [Powód]",
                category: "Administracyjne",
                flags: "`-m` - Ukrywa moderatora"

            }
        });
    }

    async run(message, { args, flags, prefix }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<Użytkownik>\`\nNie oznaczono użytkownika.\n\nPoprawne użycie: \`${prefix}unban <Użytkownik> [Powód]\``);
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!target) return sender.warn(`Nie znaleziono takiego użytkownika. Użyj komendy \`${prefix}fetch <ID>\` by wprowadzić takiego użytkownika do pamięci.`);

        let banned;
        const banList = await message.guild.fetchBans();
        banList.forEach(user => {
            if (user.user?.id === target.id) banned = true;
        });
        if (!banned) return sender.error(`Ten użytkownik nie jest zbanowany na tym serwerze`);

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Nie został podany.";
        let hide = [];
        let wys;

        let mod = `${message.author.tag} (\`${message.author.id}\`)`;

        if (flags.includes("m")) mod = "[Ukryto]";

        if (flags.includes("m")) hide.push("mod");

        const { caseid } = await client.db.punishments.create(message.guild.id, target.id, message.author.id, reason, "unban", {
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
                .addField("**Akcja:**", "Odbanowanie użytkownika (unban)")
            ).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono");
            if (!wys) wys = "<:check_green:814098229712781313> Dostarczono.";
        }

        await message.guild.members.unban(target.id).catch(() => {
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
            .addField("**Akcja:**", "Odbanowanie użytkownika (unban)")
            .setColor("GREEN")
        );


    }
}

module.exports = UnBanCommand;