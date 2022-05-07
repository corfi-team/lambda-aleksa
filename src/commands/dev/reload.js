const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed } = require("discord.js");

class ReloadCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "reload",
                permissionLevel: 6,
                aliases: ["rl"]
            },
            help: {
                description: "Reloaduje różne rzeczy w bocie",
                usage: "<p>reload",
                category: "Deweloperskie"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        switch (args[0]?.toLowerCase()) {
            case "command":
            case "cmd":
            case "c": {
                if (args[1] === "all") {
                    for (const cmd of client.commands.array()) {
                        const reloaded = await cmd.reload().catch(e => e);

                        if (reloaded instanceof Error) return sender.error(`\`\`\`${reloaded.stack}\`\`\``);
                    }
                    return sender.create(`Przeładowano wszystkie komendy`, "<:check_green:814098229712781313> Przeładowano komendy");
                }
                if (!args[1]) return sender.warn("Nie podano komendy");
                const command = client.commands.get(args[1]) || client.commands.find(cmd => cmd.conf.aliases && cmd.conf.aliases.includes(args[1]));
                if (!command) return sender.warn("Nie ma takiej komendy");

                const reloaded = await command.reload().catch(e => e);

                if (reloaded instanceof Error) return sender.error(`\`\`\`${reloaded.stack}\`\`\``);

                sender.create(`Przeładowano ${command.conf.name}`, "<:check_green:814098229712781313> Przeładowano komende");

                break;
            }

            case "addcmd":
            case "ac": {
                const path = args[1];
                if (!path) return sender.warn("Podaj sciezke do pliku (np: `fun/mem.js`)");
                const file = require("../../commands/" + path);
                const cmd = new file();

                cmd.conf.fileName = path;

                client.commands.set(cmd.conf.name, cmd);

                sender.create(`Załadowano ${cmd.conf.name}`, "<:check_green:814098229712781313> Załadowano komende");

                break;
            }

            case "ae":
            case "addev":
            case "addevent": {
                const path = args[1];
                if (!path) return sender.warn("Podaj sciezke do pliku (np: `bot/ready.js`)");
                const file = require("../../events/" + path);
                const cmd = new file();

                cmd.conf.fileName = path;

                client.events.set(cmd.conf.name, cmd);

                sender.create(`Załadowano ${cmd.conf.name}`, "<:check_green:814098229712781313> Załadowano event");

                break;
            }

            case "event":
            case "ev":
            case "e":
            case "l": {
                if (args[1] === "all") {
                    for (const ev of client.events.array()) {
                        const reloaded = await ev.reload().catch(e => e);

                        if (reloaded instanceof Error) return sender.error(`\`\`\`${reloaded.stack}\`\`\``);
                    }
                    return sender.create(`Przeładowano wszystkie eventy`, "<:check_green:814098229712781313> Przeładowano eventy");
                }
                if (!args[1]) return sender.warn("Nie podano komendy");
                const event = client.events.get(args[1]);
                if (!event) return sender.warn("Nie ma takiej komendy");

                const reloaded = await event.reload().catch(e => e);

                if (reloaded instanceof Error) return sender.error(`\`\`\`${reloaded.stack}\`\`\``);

                sender.create(`Przeładowano ${event.conf.name}`, "<:check_green:814098229712781313> Przeładowano event");

                break;
            }

            default: {
                const embed = new MessageEmbed()
                    .setTitle("<:check_green:814098229712781313> Reload")
                    .setColor(message.guild.settings?.colors?.done)
                    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .addField("Przeładowywanie komend", `\`${prefix}reload command <nazwa/alias komendy>\``)
                    .addField("Przeładowywanie eventów", `\`${prefix}reload event <nazwa>\``)
                    .addField("Dodawanie komendy", `\`${prefix}reload addcmd <scieżka>\``)
                    .addField("Dodawanie eventu", `\`${prefix}reload addevent <scieżka>\``);

                message.reply(embed);
                break;
            }
        }

    }

}

module.exports = ReloadCommand;