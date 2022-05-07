const ms = require("../../lib/modules/Ms");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class SlowmodeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "slowmode",
                aliases: ["slow", "sl"],
                permissionLevel: 4
            },
            help: {
                description: "Ustawia slowmode na kanał tekstowy.",
                usage: "<p>slowmode <Czas> [#Kanał]",
                category: "Administracyjne",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (args[0]?.includes("s") || args[0]?.includes("m") || args[0]?.includes("h") || args[0] === "off") {
            let time = ms(args[0]);
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

            if (args[0].toLowerCase() === "off") time = 0;
            else {
                if (!time) return sender.warn(`Poprawne użycie: \`${prefix}slowmode <1m/1s/1h/off> [kanał]\``);
                if (time > 21600 * 1000) return sender.warn(`Slowmode może byc ustawiony na maksymalnie 6h`);
            }
            channel.setRateLimitPerUser(time / 1000, message.author.tag).then(() => {
                if (args[0] === "off") return sender.create(`Wyłączono tryb powolny na kanale ${channel}`);
                sender.create(`Ustawiono tryb powolny na kanale ${channel} na ${args[0]}`);
            }).catch(() => sender.error("Wystąpił błąd z aktualizacją slowmode. Prawdopodobnie nie mam do tego uprawnień lub źle podałeś czas."));

        } else {
            return sender.warn(`Podano nieprawidłowy argument \`<czas>\`.\nPrawidłowe użycie: \`${prefix}slowmode <1s/1m/1h/off> [kanal]\``);
        }
    }

}

module.exports = SlowmodeCommand;