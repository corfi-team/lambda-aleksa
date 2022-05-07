const BaseCommand = require("../../lib/base/BaseCommand");
const { execSync } = require("child_process");
const { MessageEmbed } = require("discord.js");

class EvalCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "shell",
                permissionLevel: 6
            },
            help: {
                description: "Wykonuje komende w konsoli",
                usage: "<p>shell <komenda>",
                category: "Deweloperskie"
            }
        });
    }

    async run(message, { args }) {
        let query = args.join(" ") || "null";
        let data;
        try {
            data = await execSync(query);
        } catch (err) {
            if (query.length > 1012) query = query.substring(0, 1010) + "...";
            if (err.toString().length > 1012) err = err.toString().substring(0, 1010) + "...";
            const embederror = new MessageEmbed()
                .setTitle(`<:check_red:814098202063405056> Error`)
                .addField("Input", `\`\`\`yaml\n${query}\`\`\``)
                .addField("Output", `\`\`\`yaml\n${err || "null"}\`\`\``)
                .setColor("RED")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            return message.reply(embederror);
        }
        if (query.length > 1012) query = query.substring(0, 1010) + "...";
        if (data.toString().length > 1012) data = data.toString().substring(0, 1010) + "...";
        data = data.toString();
        const embed = new MessageEmbed()
            .setTitle("<:check_green:814098229712781313> Shell")
            .addField("Input", `\`\`\`yaml\n${query}\`\`\``)
            .addField("Output", `\`\`\`yaml\n${data || "null"}\`\`\``)
            .setColor(message.guild.settings.colors.done)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);
    }
}

module.exports = EvalCommand;