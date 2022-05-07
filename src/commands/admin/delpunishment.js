const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class DelPunishmentCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "delpunishment",
                aliases: ["delpunish", "delcase"],
                permissionLevel: 4
            },
            help: {
                description: "Usuwa punishment",
                usage: "<p>delpunishment <Numer>",
                category: "Administracyjne",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const number = args[0];

        if (!number || !parseInt(number)) return sender.warn(`Nie poprawny argument \`<numer>\`\nNie podano numeru kary\n\nPoprawne użycie: \`${prefix}delpunishment <numer>\``);

        const punish = await client.db.punishments.remove(message.guild.id, number, message.author.id);

        if (!punish) return sender.warn(`Nie poprawny argument \`<numer>\`\nNie znaleziono takiej kary\n\nPoprawne użycie: \`${prefix}delpunishment <numer>\``);
        sender.create(`Usunięto punishment o id ${number}`, "<:check_green:814098229712781313> Usunieto punishment");
    }
}

module.exports = DelPunishmentCommand;