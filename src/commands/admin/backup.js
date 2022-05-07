const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const discordbackup = require("discord-backup");

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

class BackupCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "backup",
                permissionLevel: 4,
                botPerm: "ADMINISTRATOR"
            },
            help: {
                description: "Zarządza backupami",
                usage: "<p>backup <akcja (create/info/load/delete)>",
                category: "Administracyjne",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        switch (args[0]) {
            case "create": {
                const guildData = await discordbackup.create(message.guild, {
                    jsonSave: false, maxMessagesPerChannel: 0
                });
                const { id } = await client.db.backups.create(message.author.id, client.functions.removeUndefineds(guildData));
                sender.create(`ID backupa: \`${id}\`\n\nBy załadować backupa wpisz \`${prefix}backup load ${id}\``, "📄 Stworzono backupa");
                break;
            }

            case "remove": {
                const id = args[1];
                if (!id) return sender.warn(`Niepoprawny argument \`<id>\`\nNie podano ID backupa\n\nPoprawne użycie: \`${prefix}backup remove <ID>\``);
                const backup = await client.db.backups.remove(id);
                if (!backup) return sender.warn(`Niepoprawny argument \`<id>\`\nNie znaleziono backupa\n\nPoprawne użycie: \`${prefix}backup remove <ID>\``);
                sender.create(`Pomyślnie usunieto kopie o id ${id}`, "📄 Usunięto kopie!");
                break;
            }

            case "load": {
                const id = args[1];
                if (!id) return sender.warn(`Niepoprawny argument \`<id>\`\nNie podano ID backupa\n\nPoprawne użycie: \`${prefix}backup load <ID>\``);
                const backup = await client.db.backups.get(id);
                if (!backup) return sender.warn(`Niepoprawny argument \`<id>\`\nNie znaleziono backupa\n\nPoprawne użycie: \`${prefix}backup load <ID>\``);

                if (backup.userid !== message.author.id) return sender.warn("Ten backup nie jest twój!");

                const embedQuestion = new MessageEmbed()
                    .setTitle("📄 Wczytywanie Backupa")
                    .setDescription("Uwaga, wczytanie backupa usunie wszystko z serwera i wczyta backup!\nNaciśnij <:check_green:814098229712781313> by zaakceptować wczytywanie backupa lub <:check_red:814098202063405056> by anulować")
                    .setColor(message.guild.settings.colors?.done)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL());
                const msg = await message.reply(embedQuestion);
                await msg.react("814098229712781313"); // green
                await msg.react("814098202063405056"); // red

                const filter = (reaction, user) => {
                    return user.id === message.author.id;
                };
                const collector = msg.createReactionCollector(filter, { time: 15000 });

                collector.on("end", () => {
                    msg.reactions.removeAll().catch(() => {
                    });
                });

                collector.on("collect", async (reaction) => {
                    switch (reaction.emoji?.id) {
                        case "814098229712781313": {
                            const embedDone = new MessageEmbed()
                                .setTitle("📄 Wczytywanie backupa")
                                .setDescription("Rozpoczęto wczytywanie backupa.\nBackup zostanie wczytany za 2 sekundy")
                                .setColor(message.guild.settings.colors?.done)
                                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                                .setFooter(client.footer, client.user.displayAvatarURL());
                            await msg.edit(embedDone);

                            await collector.stop();

                            await sleep(2000);

                            await discordbackup.load(backup.backupData, message.guild);

                            return;
                        }
                        case "814098202063405056": {
                            const embedDone = new MessageEmbed()
                                .setTitle("📄 Wczytywanie backupa")
                                .setDescription("Anulowano wczytywanie backupa")
                                .setColor(message.guild.settings.colors?.done)
                                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                                .setFooter(client.footer, client.user.displayAvatarURL());
                            await msg.edit(embedDone);

                            await collector.stop();

                            return;
                        }
                    }
                });

                break;
            }
            default:
                return sender.warn(`Niepoprawny argument \`<akcja (create/remove/load)>\`\nNie podano akcji\n\nPoprawne użycie: \`${prefix}backup <akcja (load/create/remove)>\``);
        }
    }
}

module.exports = BackupCommand;