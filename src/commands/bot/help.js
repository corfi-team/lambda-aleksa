const BaseCommand = require("../../lib/base/BaseCommand");
const { MessageEmbed } = require("discord.js");
const Sender = require("../../lib/modules/Sender");
const perms = {
    1: "1: Użytkownik",
    2: "2: Pomocnik",
    3: "3: Moderator",
    4: "4: Administator",
    5: "5: Właściciel serwera",
    6: "6: Programista"
};

class HelpCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "help",
                aliases: ["h", "pomoc"],
            },
            help: {
                description: "Komenda pomocy",
                usage: "<p>help",
                category: "Bot",
            }
        });
    }

    async run(message, { args, guildConf, prefix }) {
        const sender = new Sender(message);
        if (args[0]) {
            if (args[0]?.toLowerCase() === "meme") {
                return sender.create(`
                    \`${guildConf.prefixes[0]}meme remove <Meme ID>\` - usuwa mema o podanym ID.
                    \`${guildConf.prefixes[0]}meme view <Meme ID>\` - wyświetla mema o podanym ID
                    \`${guildConf.prefixes[0]}meme list <@Użytkownik>\` - wyświetla wszystkie memy, które wysłał podany użytkownik.
                    `, "😂 Memy");
            }
            const command = client.commands.get(args[0]) || client.commands.find(x => x.conf.aliases && x.conf.aliases.includes(args[0]));
            if (!command) return sender.warn("Nie znaleziono takiej komendy");

            if (command.help.category === "Prywatne") return sender.warn("Ta komenda jest tajna (͡° ͜ʖ ͡°)");
            const embed = new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setColor(message.guild.settings?.colors?.done)
                .setTitle("<:check_green:814098229712781313> Pomoc dotycząca komendy")
                .addField("Nazwa", `\`${command.conf.name}\``)
                .addField("Aliases", `${command.conf.aliases.length ? `\`${command.conf.aliases.join(", ")}\`` : "Brak"}`)
                .addField("Opis", `\`${command.help.description}\``)
                .addField("Wyłączona", `\`${command.conf.disabled ? "Tak" : "Nie"}\``)
                .addField("Wymagane uprawnienia:", `\`${perms[command.conf.permissionLevel || 1]}\``)
                .addField("Wymagane uprawnienia bota:", `\`${command.conf.botPerm || "SEND_MESSAGES"}\``)
                .addField("Kategoria", `\`${command.help.category}\``)
                .addField("Użycie:", `\`${command.help.usage.replace(/<p>/g, prefix)}\``)
                .addField("Flagi", `${command.help.flags || "Brak"}`);
            message.reply(embed);
        } else {
            const devCommands = client.commands.filter(x => x.help.category === "Deweloperskie" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const adminCommands = client.commands.filter(x => x.help.category === "Administracyjne" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const configCommands = client.commands.filter(x => x.help.category === "Konfiguracyjne" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const funCommands = client.commands.filter(x => x.help.category === "Zabawa" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const toolsCommands = client.commands.filter(x => x.help.category === "Narzędzia" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const giveawayCommands = client.commands.filter(x => x.help.category === "Giveaways" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const botsCommands = client.commands.filter(x => x.help.category === "Bot" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const levelsCommands = client.commands.filter(x => x.help.category === "Poziomy" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const animeCommands = client.commands.filter(x => x.help.category === "Anime" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
            const imgCommands = client.commands.filter(x => x.help.category === "Obrazki" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];

            const embed = new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setColor(message.guild.settings?.colors?.done)
                .setTitle("<:check_green:814098229712781313> Pomoc")
                .addField(`<:icon_bot:705077043594920026> Komendy podstawowe (\`${botsCommands.length}\`)`, botsCommands.join(", ") || "Brak")
                .addField(`<:badge_developer:705076933645434891> Komendy deweloperskie (\`${devCommands.length}\`)`, devCommands.join(", ") || "Brak")
                .addField(`<:icon_ban:724362485116960779> Komendy administracyjne (\`${adminCommands.length}\`)`, adminCommands.join(", ") || "Brak")
                .addField(`<:icon_settings:705076529561862174> Komendy konfiguracyjne (\`${configCommands.length}\`)`, configCommands.join(", ") || "Brak")
                .addField(`<a:icon_emoji:724362696069349406> Fun (\`${funCommands.length}\`)`, funCommands.join(", ") || "Brak")
                .addField(`<:icon_mention:705076605172842496> Obrazkowe (\`${imgCommands.length}\`)`, imgCommands.join(", ") || "Brak")
                .addField(`🇯🇵 Anime (\`${animeCommands.length}\`)`, animeCommands.join(", ") || "Brak")
                .addField(`<:icon_pin:705076546452324432> Narzędzia (\`${toolsCommands.length}\`)`, toolsCommands.join(", ") || "Brak")
                .addField(`🎉 Giveaway (\`${giveawayCommands.length}\`)`, giveawayCommands.join(", ") || "Brak")
                .addField(`<:icon_channel:705076734730567760> Poziomy (\`${levelsCommands.length}\`)`, levelsCommands.join(", ") || "Brak");
            message.reply(embed);
        }

    }
}

module.exports = HelpCommand;
