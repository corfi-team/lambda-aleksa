const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed } = require("discord.js");

const ReactionPageMenu = require("../../lib/modules/ReactionPageMenu");

class PremiumCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "premium",
                aliases: [],
                permissionLevel: 6
            },
            help: {
                description: "Blokuje dostep do komend",
                usage: "<p>gban <add/remove/list> [Użytkownik]",
                category: "Deweloperskie"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        switch (args[0]?.toLowerCase()) {
            case "add": {
                const server = client.guilds.cache.get(args[0]);
                if (!server) return sender.warn("Ten serwer nie istnieje");
                await client.db.servers.get(server.id);
                client.db.servers.update(server.id, {
                    premium: {
                        status: true,
                        addedby: message.author.id,
                        end: null
                    }
                });
                sender.create(`Dodano premium dla serwera ${server.name}`, "<:check_green:814098229712781313> Premium");
                break;
            }
            case "remove": {
                const server = client.guilds.cache.get(args[0]);
                if (!server) return sender.warn("Ten serwer nie istnieje");
                await client.db.servers.get(server.id);
                client.db.servers.update(server.id, {
                    premium: {
                        status: false,
                    }
                });
                sender.create(`Zabrano premium serwerowi ${server.name}`, "<:check_green:814098229712781313> Premium");
                break;
            }

            default:
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

module.exports = PremiumCommand;
