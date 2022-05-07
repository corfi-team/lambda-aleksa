const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed } = require("discord.js");

const ReactionPageMenu = require("../../lib/modules/ReactionPageMenu");

class GbanCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "gban",
                aliases: ["gdzban", "bl", "blacklist"],
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
                const member = await client.functions.getUser(message, args[1]) || await client.functions.fetchUser(message, args[1]);
                if (!member) return sender.warn("Nie znaleziono użytkownika");
                const reason = args.slice(2).join(" ") || "Nie podano";
                const gbanned = await client.db.gbans.add(member.id, message.author.id, reason);
                if (!gbanned) return sender.warn("Ten użytkownik ma gbana");

                // let wys;
                // MemberSend
                // const embed = new MessageEmbed()
                //     .setTitle("<:RedFlag:708255358035951617> Globalny ban")
                //     .setColor("RED")
                //     .addField("Powód", reason)
                //     .addField("Developer", `${message.author.tag} (\`${message.author.id}\`)`)
                //     .setDescription("Od teraz nie możesz używać komend do czasu unbana")
                //     .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                //     .setFooter(client.footer, client.user.displayAvatarURL())
                // await member.send(embed).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono")
                // if (!wys) wys = "<:check_green:814098229712781313> Dostarczono."
                // MessageChannel
                const embed2 = new MessageEmbed()
                    .setTitle("<:RedFlag:708255358035951617> Globalny ban")
                    .setColor("RED")
                    .addField("Powód:", reason)
                    .addField("Użytkownik", `${member.tag} (\`${member.id}\`)`)
                    .addField("Developer:", `${message.author.tag} (\`${message.author.id}\`)`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL());
                message.reply(embed2);
                // Gbans logs channel
                const embed3 = new MessageEmbed()
                    .setTitle("<:RedFlag:708255358035951617> Globalny ban")
                    .setColor("RED")
                    .addField("Powód:", reason)
                    .addField("Użytkownik", `${member.tag} (\`${member.id}\`)`)
                    .addField("Developer:", `${message.author.tag} (\`${message.author.id}\`)`)
                    //.addField("Info na DM:", wys)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL());
                client.channels.cache.get("815312229524176897").send(embed3);
                break;
            }
            case "remove": {
                const member = await client.functions.getUser(message, args[1]) || await client.functions.fetchUser(message, args[1]);
                if (!member) return sender.warn("Nie znaleziono użytkownika");
                const reason = args.slice(2).join(" ") || "Nie podano";

                const gunbanned = await client.db.gbans.remove(member.id);
                if (!gunbanned) return sender.warn("Ten użytkownik nie ma gbana");

                // let wys;
                // // MemberSend
                // const embed = new MessageEmbed()
                //     .setTitle("<:RedFlag:708255358035951617> Globalny unban")
                //     .setColor("RED")
                //     .addField("Powód", reason)
                //     .addField("Developer", `${message.author.tag} (\`${message.author.id}\`)`)
                //     .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                //     .setFooter(client.footer, client.user.displayAvatarURL())
                // await member.send(embed).catch(() => wys = "<:check_red:814098202063405056> Nie dostarczono")
                // if (!wys) wys = "<:check_green:814098229712781313> Dostarczono."
                // MessageChannel
                const embed2 = new MessageEmbed()
                    .setTitle("<:RedFlag:708255358035951617> Globalny unban")
                    .setColor("RED")
                    .addField("Powód:", reason)
                    .addField("Użytkownik", `${member.tag} (\`${member.id}\`)`)
                    .addField("Developer:", `${message.author.tag} (\`${message.author.id}\`)`)
                    //.addField("Info na DM:", wys)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL());
                message.reply(embed2);
                // Gbans logs channel
                const embed3 = new MessageEmbed()
                    .setTitle("<:RedFlag:708255358035951617> Globalny unban")
                    .setColor("RED")
                    .addField("Użytkownik", `${member.tag} (\`${member.id}\`)`)
                    .addField("Powód:", reason)
                    .addField("Developer:", `${message.author.tag} (\`${message.author.id}\`)`)
                    // .addField("Info na DM:", wys)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL());
                client.channels.cache.get("815312229524176897").send(embed3);
                break;
            }

            case "list": {
                const list = await client.db.gbans.list();
                if (!list.length) return sender.warn("Nie ma gbanów :<");

                const formatedList = list.chunk(5);
                const embeds = [];
                for (const gbans of formatedList) {
                    const embed = new MessageEmbed()
                        .setTitle("Lista gbanów")
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                        .setColor(message.guild.settings?.colors?.done);
                    for (const gban of gbans) {
                        const user = await client.users.fetch(gban.id);
                        embed.addField(`${user?.tag}`, `Powód: \`${gban.reason}\`\nData: \`${new Date(gban.date).toLocaleString()}\`\nDeveloper: \`${client.users.cache.get(gban.developer)?.tag}\``);
                    }
                    embeds.push(embed);
                }
                new ReactionPageMenu({
                    message: message,
                    channel: message.channel,
                    pages: embeds,
                    userID: message.author.id
                });

                break;
            }

            default:
                sender.warn(`Nie poprawny argument <akcja>\nNie podano akcji\n\nPoprawne użycie: \`${prefix}gban <add/remove> <user> <powod>\``);
        }
    }
}

module.exports = GbanCommand;