const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const canvacord = require("canvacord");

class RankCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "setlevel",
                aliases: ["st", "ustawpoziom"],
                permissionLevel: 4
            },
            help: {
                description: "Ustawia użytkownikowi poziom",
                usage: "<p>setlevel <użytkownik> <poziom>",
                category: "Poziomy"
            }
        });
    }

    async run(message, { args, guildConf, prefix }) {
        const sender = new Sender(message);
        if (!guildConf.leveling?.status) return sender.warn("System poziomów jest wyłączony!");
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        if (!member) return sender.warn(`Nieprawidłowy argument \`<użytkownik>\`\nNie podano użytkownika lub podano nieprawidłowego\n\nPoprawne użycie: \`${prefix}setlevel <użytkownik> <poziom>\``);
        const level = args[1];

        await client.db.leveling.get(message.guild.id, member.id);

        if (!level || typeof parseInt(level) !== "number" || parseInt(level) < 0) return sender.warn(`Nieprawidłowy argument \`<poziom>\`\nNie podano poziomu lub podano nieprawidłowy\n\nPoprawne użycie: \`${prefix}setlevel <użytkownik> <poziom>\``);

        await client.db.leveling.update(message.guild.id, member.id, {
            level: parseInt(level)
        });

        sender.create(`Użytkownik <@${member.id}> ma teraz poziom \`${level}\``, "<:check_green:814098229712781313> Ustawiono poziam");
    }
}

module.exports = RankCommand;