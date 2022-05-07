const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const moment = require("moment");
moment.locale("PL");

class UserinfoCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "userinfo",
                aliases: ["ui", "uzytkownik", "użytkownik", "gracz", "graczinfo", "whois", "ktoto"],
            },
            help: {
                description: "Pokazuje informacje o podanym użytkowniku.",
                usage: "<p>userinfo <Użytkownik>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args }) {
        const target = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
        let activity = "";
        const devices = target.presence.clientStatus;
        switch (target.presence.status) {
            case "dnd": {
                if (devices?.desktop) activity += "<a:presence_dnd_desktop:728009381911724052> ";
                if (devices?.mobile) activity += "<a:presence_dnd_mobile:728009223870349403> ";
                if (devices?.web) activity += "<:presnece_dnd_web:728008303451570306> ";
                break;
            }
            case "idle": {
                if (devices?.desktop) activity += "<a:presence_idle_desktop:728009585709023274> ";
                if (devices?.mobile) activity += "<a:presence_idle_mobile:728009130010345513> ";
                if (devices?.web) activity += "<:presence_idle_web:728008451992846388> ";
                break;
            }
            case "online": {
                if (devices?.desktop) activity += "<a:presence_online_desktop:728009703539343486> ";
                if (devices?.mobile) activity += "<a:presence_online_mobile:728008967002783773> ";
                if (devices?.web) activity += "<a:presence_online_web:728008783254650900> ";
                break;
            }
        }

        let badgesEmojis = {
            "BUGHUNTER_LEVEL_1": "<:badge_bughunter:705076975139553330>",
            "BUGHUNTER_LEVEL_2": "<:badge_bughunter_lvl2:705076958161010788>",
            "DISCORD_EMPLOYEE": "<:badge_staff:705076790644834345>",
            "DISCORD_NITRO": "<:badge_nitro:778399916418269225>",
            "DISCORD_PARTNER": "<a:badge_partner2:764872124518367242>",
            "EARLY_SUPPORTER": "<:badge_early_supporter:706879932491628594>",
            "HOUSE_BALANCE": "<:badge_balance:706860952821432371>",
            "HOUSE_BRILLIANCE": "<:badge_brilliance:705077008585195661>",
            "HOUSE_BRAVERY": "<:badge_bravery:705077026348073010>",
            "HYPESQUAD_EVENTS": "<:badge_hypesquad_events:705076862937989261>",
            "VERIFIED_DEVELOPER": "<:badge_developer:705076933645434891>"
        };

        if (!activity) activity = "<:status_offline2:705078409700704396>";
        let fetchFlags = ((target.flags || target.fetchFlags()).toArray());
        let flags = [];
        fetchFlags = fetchFlags.filter(x => x !== "EARLY_VERIFIED_DEVELOPER");
        fetchFlags.forEach(x => flags.push(badgesEmojis[x]));
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setTitle("<:check_green:814098229712781313> Informacje o użytkowniku")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setThumbnail(target.displayAvatarURL(ImageURLOptions))
            .addField("**Nick**", `${target.tag} ${target.nickname ? `(*${target.nickname}*)` : ""}`)
            .addField("**ID**", `${target.id}`)
            .addField("**Bot?**", `${target.bot ? "Tak." : "Nie."}`)
            .addField("Aktywność", activity)
            .addField("**Utworzenie konta**", `${moment(target.createdTimestamp).format("LLLL")}\n**(${moment(target.createdAt).fromNow()})**`)
            .addField("**Odznaki**", flags.join(", ") || "Brak");
        message.reply(embed);

    }
}

module.exports = UserinfoCommand;