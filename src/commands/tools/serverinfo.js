const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
//const Sender = require("../../lib/modules/Sender");
const region = {
    "brazil": "Brazylia",
    "europe": "Europa",
    "eu-central": "Europa Centralna",
    "hongkong": "Hong Kong",
    "india": "India",
    "japan": "Japonia",
    "russia": "Rosja",
    "singapore": "Singapur",
    "southafrica": " Afryka Południowa",
    "sydney": "Sydney",
    "us-central": "U.S. Central",
    "us-east": "U.S. East",
    "us-south": "U.S. South",
    "us-west": "U.S. West"
};

class ServerinfoCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "serverinfo",
                aliases: ["si", "serveri", "server", "serwer", "serwerinfo"],
            },
            help: {
                description: "Pokazuje informacje o serwerze",
                usage: "<p>serverinfo",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args }) {
        //const sender = new Sender(message);
        const guild = client.guilds.cache.get(args[0]) || message.guild;

        const owner = await client.users.fetch(guild.ownerID).catch(() => "Nie znaleziono");
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))

            .setFooter(client.footer, client.user.displayAvatarURL())
            .setColor(message.guild.settings?.colors?.done)
            .setThumbnail(guild.iconURL(ImageURLOptions))
            .setTitle("<:check_green:814098229712781313> Informacje o serwerze")
            .addField("Nazwa serwera", `${guild.name}`)
            .addField("Własciciel serwera", `${owner}`)
            .addField("Region", `${region[guild.region]}`)
            .addField("Kanał AFK", guild.afkChannel ? guild.afkChannel.name : "Brak.")
            .addField("Użytkownicy", guild.members.cache.filter((m) => !m.user.bot).size)
            .addField("Boty", guild.members.cache.filter((m) => m.user.bot).size)
            .addField("Ilość kanałów", guild.channels.cache.size)
            .addField("Ilość ról:", `${guild.roles.cache.size}`)
            .addField("Ilość emoji:", `${guild.emojis.cache.size}`);
        message.reply(embed);

    }
}

module.exports = ServerinfoCommand;