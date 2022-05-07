const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Eval = require("../../lib/apis/OpenEval");
const Sender = require("../../lib/modules/Sender");
const codeBlocks = {
    python3: "py",
    python2: "py",
    node: "js"
};

class OpenEvalCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "openeval",
                aliases: ["oe"],
            },
            help: {
                description: "Wykonuje ",
                usage: "<p>openeval <język> <kod>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const ev = new Eval();
        const lang = args[0];
        if (!lang) return sender.warn(`Niepoprawny argument \`<język>\`\nNie podano języka\n\nPoprawne użycie: \`${prefix}openeval <język> <kod>\``);
        const input = args.slice(1).join(" ");
        if (!input) return sender.warn(`Niepoprawny argument \`<kod>\`\nNie podano kodu\n\nPoprawne użycie: \`${prefix}openeval <język> <kod>\``);
        if (input.length > 1000) return sender.warn(`Niepoprawny argument \`<kod>\`\nKod jest dłuższy niż \`1000\`\n\nPoprawne użycie: \`${prefix}openeval <język> <kod>\``);

        const evaled = await ev.eval(lang, input);

        if (evaled.message === "Supplied language is not supported by Piston") return sender.warn(`Niepoprawny argument \`<język>\`\nPodano niepoprawny język\n\nPoprawne użycie: \`${prefix}openeval <język> <kod>\``);
        if (evaled.stderr) {
            const embed = new MessageEmbed()
                .setTitle("<:check_red:814098202063405056> Błąd")
                .setColor(message.guild.settings?.colors?.error)
                .setDescription(`Język: \`${evaled.language}\`\nWersja języka: \`${evaled.version}\`\nZwrot:\n\`\`\`${codeBlocks[evaled.language] || evaled.language}\n${evaled.stderr || "\"\""}\`\`\``)
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions));
            return message.reply(embed).catch(() => {
                return sender.error("Wystąpił błąd. Prawdopodbnie zwrot jest zbyt duży");
            });
        }
        const embed = new MessageEmbed()
            .setTitle("<:check_green:814098229712781313> OpenEval")
            .setColor(message.guild.settings?.colors?.error)
            .setDescription(`Język: \`${evaled.language}\`\nWersja języka: \`${evaled.version}\`\nZwrot:\n\`\`\`${codeBlocks[evaled.language] || evaled.language}\n${evaled.output || "\"\""}\`\`\``)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions));
        return message.reply(embed).catch(() => {
            return sender.error("Wystąpił błąd. Prawdopodbnie zwrot jest zbyt duży");
        });
    }
}

module.exports = OpenEvalCommand;