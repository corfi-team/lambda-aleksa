const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

class MembersCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "members",
                aliases: ["czlonkowie", "membercount", "ludzie"],
            },
            help: {
                description: "Pokazuje ilość osób na serwerze.",
                usage: "<p>members",
                category: "Narzędzia",
            }
        });
    }

    async run(message) {
        const all = message.guild.members.cache;
        message.reply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setFooter(client.footer, client.user.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done || "GREEN")
            .setDescription(`**${all.size}** wszystkich (\`osoby + boty\`)\n**${all.filter((m) => m.user.bot).size}** botów\n**${all.filter((m) => !m.user.bot).size}** osób.`)
        );
    }
}

module.exports = MembersCommand;