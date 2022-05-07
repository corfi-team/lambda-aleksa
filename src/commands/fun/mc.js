const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");

class McCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "mc",
            },
            help: {
                description: "Pokazuje informacje o danym serwerze minecraft",
                usage: "<p>mc <typ (server/user)> <ip/nazwa>",
                category: "Zabawa"
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        switch (args[0]) {
            case "server": {
                message.channel.startTyping(1);
                const server = await fetch(`https://api.mcsrvstat.us/2/${args[1]}`).then(response => response.json());
                message.channel.stopTyping(1);
                const attachment = new MessageAttachment(`http://status.mclive.eu/${args[1]}/${args[1]}/25565/banner.png`, "mc.png");
                if (!server.ip) return sender.warn(`Niepoprawny argument \`<ip>\`\nNie podano ip serwera lub podano nieprawidłowe\n\nPoprawne użycie: \`${prefix}mc server <ip>\``);

                let motd = "Brak";
                if (server.motd.clean) {
                    motd = "";
                    for (const r of server.motd.clean) motd += `${r}\n`;
                }
                const embed = new MessageEmbed()
                    .setTitle(`<:check_green:814098229712781313> Serwer Minecraft`)
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor(message.guild.settings?.colors?.done)
                    .attachFiles(attachment)
                    .setImage(`attachment://mc.png`)
                    .addField("IP", `\`${server.ip}:${server.port}\``)
                    .addField(`Serwer online`, `${client.functions.resolveBool("PL", "YesNo", server.online)}`)
                    .addField(`Animowane motd`, `${client.functions.resolveBool("PL", "YesNo", server.debug.animatedmotd)}`)
                    .addField(`Gracze`, `${server.players.online} z ${server.players.max}`)
                    .addField(`Motd`, `\`\`\`${motd}\`\`\``)
                    .addField(`Wersja gry`, `\`${server.version}\``)
                    .addField("Nazwa hosta", `\`${server.hostname}\``)
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
                return message.reply(embed);
            }
            case "user": {
                const user = await fetch(`https://api.ashcon.app/mojang/v2/user/${args[1]}`).then(res => res.json());
                if (user.code === 404 || !user.username) return sender.warn(`Niepoprawny argument \`<nazwa>\`\nNie podano nazwy lub podano nieprawidłową\n\nPoprawne użycie: \`${prefix}mc user <nazwa>\``);
                let usernames = "Brak";
                if (user.username_history) {
                    usernames = "";
                    for (const r of user.username_history) usernames += `${r.username}\n`;
                }
                const attachment = new MessageAttachment(`https://minotar.net/avatar/${user.username}`, "head.png");
                const embed = new MessageEmbed()
                    .setTitle(`<:check_green:814098229712781313> Użytkownik Minecraft`)
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor(message.guild.settings?.colors?.done)
                    .addField("UUID", `\`${user.uuid}\``)
                    .addField("Aktualny nick", `\`${user.username}\``)
                    .addField("Historia nicków", `\`\`\`yaml\n${usernames}\`\`\``)
                    .addField("Data stworzenia konta", `\`${user.created_at || "Brak"}\``)
                    .addField("Własny skin", user.textures.custom ? "Tak" : "Nie")
                    .addField("Skin", `[klik](${user.textures.skin.url})`)
                    .setThumbnail("attachment://head.png")
                    .attachFiles(attachment);
                message.reply(embed);
                break;
            }
            default:
                return sender.warn(`Niepoprawny argument \`<typ>\`\nNie podano typu do znalezienia\n\nPoprawne użycie: \`${prefix}mc <typ (server/user)> <ip/nazwa>\``);
        }
    }


}

module.exports = McCommand;

