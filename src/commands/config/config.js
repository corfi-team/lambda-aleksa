const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class ConfigCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "config",
                aliases: ["dashboard", "panel"],
                permissionLevel: 4
            },
            help: {
                description: "Zarządza konfiguracja serwera",
                usage: "<p>config",
                category: "Konfiguracyjne",
            }
        });
    }

    async run(message) {
        const sender = new Sender(message);
        sender.create(`Komenda \`config\` została wyłączona! Od teraz wszystkie zmiany można wprowadzać w **[panelu](https://delover.xyz/dashboard/${message.guild.id})**`, "<:check_green:814098229712781313> Panel");
    }
}

module.exports = ConfigCommand;