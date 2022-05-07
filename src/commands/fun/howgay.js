const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");


class HowgayCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "howgay",
                aliases: ["hg"]
            },
            help: {
                description: "Na ile % jesteś gejem?",
                usage: "<p>howgay [user]",
                category: "Zabawa"
            }
        });

    }

    async run(message, { args }) {
        const member = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]) || message.author;
        const gay = Math.floor(Math.random() * 101);

        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setTitle(`Howgay`)
            .setDescription(`Użytkownik ${member.tag} jest gejem na: \`${gay}%\``)
            .setColor(message.guild.settings?.colors?.done)
            .setFooter(client.footer, client.user.displayAvatarURL());
        message.reply(embed);

    }
}

module.exports = HowgayCommand;
