const { inspect } = require("util");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const Discord = require("discord.js");

class EvalCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "eval",
                aliases: ["e"],
                permissionLevel: 6
            },
            help: {
                description: "Wykonuje kod javascript",
                usage: "<p>eval <kod>",
                category: "Deweloperskie"
            }
        });
    }

    async run(message, { args, flags, guildConf }) {
        const sender = new Sender(message);
        let query = args.join(" ") || null;
        let hrDiff;
        let evaled;
        try {
            let hrStart = process.hrtime();
            evaled = eval(query);
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            if (query.length > 1012) query = query.substring(0, 1010) + "...";
            if (err.stack.toString().length > 1012) err.stack = err.stack.toString().substring(0, 1010) + "...";
            const embederror = new Discord.MessageEmbed()
                .setTitle(`<:check_red:814098202063405056> Error`)
                .addField("Input:", `\`\`\`js\n${query}\n\`\`\``)
                .addField("Output:", `\`\`\`js\n${err.stack}\n\`\`\``)
                .setColor("RED")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            return message.reply(embederror);
        }

        let inspected = inspect(evaled, { depth: 0 });
        if (query.length > 1012) query = query.substring(0, 1010) + "...";
        if (inspected.toString().length > 1012) inspected = inspected.toString().substring(0, 1010) + "...";
        const embedgut = new Discord.MessageEmbed()
            .setTitle(`<:check_green:814098229712781313> Eval`)
            .addField("Input:", `\`\`\`js\n${query}\n\`\`\``)
            .addField("Output:", `\`\`\`js\n${inspected}\n\`\`\``)
            .addField("Type:", `\`\`\`yaml\n${extendedtypeof(evaled)}\n\`\`\``)
            .addField("Time", `\`\`\`yaml\n${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.\`\`\``)
            .setColor(message.guild.settings?.colors?.done)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embedgut);
    }

}

module.exports = EvalCommand;