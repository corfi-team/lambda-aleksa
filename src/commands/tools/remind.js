const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const Ms = require("../../lib/modules/Ms");
const ReactionMenu = require("../../lib/modules/ReactionPageMenu");

class RemindCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "remind",
                aliases: ["remindme"],
            },
            help: {
                description: "Zarządza przypomnieniami",
                usage: "<p>remind <add/remove/list/view>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        switch (args[0]?.toLowerCase()) {
            case "add": {
                const reminders = await client.db.reminders.getAll(message.author.id);
                if (reminders?.length >= 7) return sender.warn("Niestety wykorzystałeś już limit przypomnień. Poczekaj aż któreś wygaśnie. Aktualny limit to 7.");
                const time = Ms(args[1]);
                if (!time) return sender.warn(`Nieprawidłowy argument \`<czas>\`\nNie podano czasu\n\nPoprawne użycie: \`${prefix}remind add <czas> <tekst>\``);
                const text = args.slice(2).join(" ");
                if (!text) return sender.warn(`Nieprawidłowy argument \`<tekst>\`\nNie podano czasu\n\nPoprawne użycie: \`${prefix}remind add <czas> <tekst>\``);
                const { remindid } = await client.db.reminders.add(message.author.id, Date.now() + time, text);
                sender.create(`Data zakończenia: \`${new Date(time + Date.now()).toLocaleString()}\`\nTekst: \`${text}\`\nID: \`${remindid}\``, "⏰ Dodano przypomnienie");
                break;
            }
            case "view": {
                const id = args[1];
                if (!id || !parseInt(id)) return sender.warn(`Nieprawidłowy argument \`<id>\`\nNie podano prawidłowego id przypomnienia \n\nPoprawne użycie: \`${prefix}remind view <id>\``);
                const remind = await client.db.reminders.get(message.author.id, parseInt(id));
                if (!remind) return sender.warn(`Nieprawidłowy argument \`<id>\`\nNie znaleziono takiego przpomnienia\n\nPoprawne użycie: \`${prefix}remind view <id>\``);
                const embed = new MessageEmbed()
                    .setTitle("⏰ Przypomnienie")
                    .setDescription(`ID: \`${id}\`\nData zakończenia: \`${new Date(remind.end).toLocaleString()}\`\nTekst: \`${remind.text}\``)
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setColor("GREEN");
                message.reply(embed);
                break;
            }
            case "remove": {
                const id = args[1];
                if (!id || !parseInt(id)) return sender.warn(`Nieprawidłowy argument \`<id>\`\nNie podano prawidłowego id przypomnienia \n\nPoprawne użycie: \`${prefix}remind view <id>\``);
                const remind = await client.db.reminders.remove(message.author.id, parseInt(id));
                if (!remind) return sender.warn(`Nieprawidłowy argument \`<id>\`\nNie znaleziono takiego przpomnienia\n\nPoprawne użycie: \`${prefix}remind view <id>\``);
                sender.create(`Usunieto przypomnienie o ID: ${id}`, "⏰ Usunieto przypomnienie");
                break;
            }
            case "list": {
                const reminders = (await client.db.reminders.getAll(message.author.id))?.reverse();
                if (!reminders?.length) return sender.warn("Nie posiadasz przypomnień");
                const embeds = [];
                for (const reminds of reminders.chunk(5)) {
                    const embed = new MessageEmbed()
                        .setTitle("⏰ Lista przypomnień")
                        .setDescription(reminders?.length + "/7")
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                        .setColor("GREEN");
                    for (const remind of reminds) embed.addField(`Remind #${remind.remindid}`, `Data zakończenia: \`${new Date(remind.end).toLocaleString()}\`\nTekst: \`${remind.text}\``);
                    embeds.push(embed);
                }
                new ReactionMenu({
                    channel: message.channel,
                    pages: embeds,
                    userID: message.author.id,
                    message: message
                });
                break;
            }
            default: {
                const embed = new MessageEmbed()
                    .setTitle("⏰ Przypomnienia")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor(message.guild.settings?.colors?.done)
                    .addField("Dodawanie przypomnienia", `\`${prefix}remind add <czas> <text>\``)
                    .addField("Usuwanie przypomnienia", `\`${prefix}remind remove <ID>\``)
                    .addField("Podejrzenie autorespondera", `\`${prefix}remind view <ID>\``)
                    .addField("Lista przypomnień", `\`${prefix}remind list\``);

                return message.reply(embed);
            }

        }
    }
}

module.exports = RemindCommand;