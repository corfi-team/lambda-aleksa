const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class ClearCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "clear",
                aliases: ["purge", "prune", "wyczysc"],
                permissionLevel: 2,
                botPerm: "MANAGE_MESSAGES"
            },
            help: {
                description: "Usuwa podaną ilość wiadomości.",
                usage: "<p>clear <Ilość (1-100)>]",
                category: "Administracyjne"
            }
        });
    }

    async run(message, { args }) {
        const sender = new Sender(message);
        if (!args.length || isNaN(args[0])) return sender.warn("Niepoprawny argument `<ilość>`\nMusisz podać prawidłową liczbę w zakresie od 1 do 100.");
        const toDelCount = parseInt(args[0]);
        if (!toDelCount || toDelCount < 2 || toDelCount > 100) return sender.warn("Niepoprawny argument `<ilość>`\nMusisz podać liczbę w zakresie od 1 do 100.");
        await message.delete().catch(() => {
        });
        const msgs = await message.channel.messages.fetch({ limit: toDelCount });
        if (msgs.size === 0) return sender.warn("Nic nie usunięto.");

        const deletedMsgs = await message.channel.bulkDelete(msgs)
            .catch(async (err) => {
                switch (err.code) {
                    case 50034: {
                        return message.channel.send(new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                            .setColor(message.guild.settings?.colors?.done)
                            .setDescription("Pomyślnie usunięto wiadomości.\n\nNie udało się usunąć pozostałych wiadomości ponieważ nie mogę usuwać wiadomości starszych niż 14 dni. Musisz je usunąć ręcznie.")
                            .setFooter(`${client.footer} || Ta wiadomość zniknie za 5 sekund.`, client.user.displayAvatarURL(ImageURLOptions))
                        ).then((msg) => msg.delete({ timeout: 5000 }));
                    }
                    case 10008: {
                        return message.channel.send(new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                            .setColor(message.guild.settings?.colors?.done)
                            .setDescription("Pomyślnie usunięto wiadomości.\n\nNiestety nie udało się usunąć wszystkich wiadomośći przez błąd `Nieznana wiadomość.`")
                            .setFooter(`${client.footer} || Ta wiadomość zniknie za 5 sekund.`, client.user.displayAvatarURL(ImageURLOptions))
                        ).then((msg) => msg.delete({ timeout: 5000 }));
                    }
                    default: {
                        return message.channel.send(new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                            .setColor(message.guild.settings?.colors?.error)
                            .setDescription("Pomyślnie usunięto wiadomości.\n\nNiestety nie udało się usunąć wszystkich wiadomości przez nieznany błąd. Możesz go zgłosić.")
                            .setFooter(`${client.footer} || Ta wiadomość zniknie za 5 sekund.`, client.user.displayAvatarURL(ImageURLOptions))
                        ).then((msg) => msg.delete({ timeout: 5000 }));
                    }
                }
            });
        if (message.deletable) message.delete().catch(() => {
        });

        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done)
            .setDescription(`Pomyślnie usunięto \`${deletedMsgs.size || toDelCount}\`/\`${toDelCount}\``)
            .setFooter(`${client.footer} || Ta wiadomość zniknie za 5 sekund.`, client.user.displayAvatarURL(ImageURLOptions))
        ).then((msg) => msg.delete({ timeout: 5000 })).catch(() => {
        });
    }
}

module.exports = ClearCommand;