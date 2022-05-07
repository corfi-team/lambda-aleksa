const { inspect } = require("util");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const Discord = require("discord.js");


class EvalCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "asynceval",
                aliases: ["ae"],
                permissionLevel: 6
            },
            help: {
                description: "Ewaluuje kod javascript",
                usage: "<p>asynceval <kod>",
                category: "Deweloperskie"
            }
        });
    }

    async run(message, { args, flags, guildConf }) {
        const sender = new Sender(message);

        let query = args.join(" ");
        if (!query) query = null;
        let hrDiff;
        let evaled;

        let hrStart = process.hrtime();
        const toEval = (code) => {
            return eval(`
                const evaluate = async () => {
                    ${code}
                }
                evaluate();
            `);
        };
        try {
            evaled = await toEval(query);
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            const embederror = new Discord.MessageEmbed()
                .setTitle(`<:check_red:814098202063405056> Error`)
                .setDescription(`Input:\`\`\`js\n${query}\n\`\`\`\n Output:\`\`\`js\n${err.stack}\n\`\`\``)
                .setColor("RED")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            return message.reply(embederror);
        }

        const inspected = inspect(evaled, { depth: 0 });
        const embedgut = new Discord.MessageEmbed()
            .setTitle(`<:check_green:814098229712781313> Eval`)
            .setDescription(`Input:\`\`\`js\n${query} \n\`\`\`\n Output:\`\`\`js\n${inspected} \n\`\`\`\n Type:\`\`\`yaml\n${extendedtypeof(evaled)}\n\`\`\`\nTime: \`\`\`yaml\n${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.\`\`\``)
            .setColor(message.guild.settings?.colors?.done)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embedgut);
    }

}

module.exports = EvalCommand;