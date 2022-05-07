const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class RRCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "reactionrole",
                aliases: ["rr", "r-r", "reaction-role", "reaction-r", "reactionr"],
                permissionLevel: 4
            },
            help: {
                description: "Zarządzanie reaction role",
                usage: "<p>reactionrole <add/remove/list>",
                category: "Konfiguracyjne",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);

        const choice = args[0]?.toLowerCase();
        switch (choice) {
            case "create": {
                const link = args[1];
                const role = message.mentions.roles.first();
                const emoji = args[2];
                if (!link || !emoji || !role) return sender.warn("Nie podano wszystkich argumentów. Wpisz samą komende by zobaczyć pomoc");
                const chid = link.split("/")[5];
                const msgid = link.split("/")[6];
                const ch = client.channels.cache.get(chid);
                if (!chid || !msgid) return sender.warn("Podano niepoprawny link do wiadomości");
                if (!ch) return sender.warn(`Nie znaleziono takiej wiadomości`);
                const msg = await ch.messages.fetch(msgid);
                if (!msg) return sender.warn("Nie znaleziono takiej wiadomości");
                msg.react(emoji).catch(() => {
                    return embeds.warn("Nie moge dodac tej reakcji do wiadomości");
                }).then(() => {
                    client.db.reactionrole.add(message.guild.id, ch.id, msg.id, emoji, role.id);
                    sender.create(`Stworzono reaction role na kanale <#${ch.id}>`, "<:icon_settings:705076529561862174> Reaction Role");
                });
                break;
            }
            case "remove": {
                const link = args[1];
                const emoji = args[2];
                if (!link || !emoji) return sender.warn("Nie podano wszystkich argumentów. Wpisz samą komende by zobaczyć pomoc");
                const chid = link.split("/")[5];
                const msgid = link.split("/")[6];
                const ch = client.channels.cache.get(chid);
                if (!chid || !msgid) return sender.warn("Podano niepoprawny link do wiadomości");
                if (!ch) return sender.warn(`Nie znaleziono takiej wiadomości`);
                const msg = await ch.messages.fetch(msgid);
                if (!msg) return sender.warn("Nie znaleziono takiej wiadomości");
                const rr = client.db.reactionrole.remove(message.guild.id, msg.id, emoji);
                if (!rr) return sender.warn("Nie znaleziono tgo rr");
                sender.create(`Usunieto reaction role na kanale <#${ch.id}>`, "<:icon_settings:705076529561862174> Reaction Role");
                break;
            }
            default:
                return message.reply(new MessageEmbed()
                    .setTitle("<:icon_settings:705076529561862174> Konfiguracja rr")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor(message.guild.settings?.colors?.done)
                    .addField("Dodawanie rr", `\`${prefix}rr create <link> <emoji> <role>\``)
                    .addField("Usuwanie rr", `\`${prefix}rr remove <link> <emoji>\``)
                );
        }
    }
}

module.exports = RRCommand;