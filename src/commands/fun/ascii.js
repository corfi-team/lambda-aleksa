const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const figlet = require("figlet");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");

class AsciiCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "ascii",
                aliases: ["asci"],
            },
            help: {
                description: "Zamienia Twój tekst na format ASCII",
                usage: "<p>ascii <Tekst>",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args, flags, prefix }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<tekst>\`\nNie podano tekstu do zamiany na ascii\n\nPoprawne użycie: \`${prefix}ascii <tekst>\``);
        figlet(`${args.join("\n")}`, async (err, data) => {
            if (data.toString().length > 2047 || flags.includes("txt") || flags.includes("t")) {

                const path = `./cache/${Math.randomInt(1, 999999)}_ascii_${message.author.id}.txt`;

                await fs.writeFileSync(path, data.toString());
                const embed = new MessageEmbed()
                    .setColor(message.guild.settings?.colors?.done)
                    .setTitle("<:check_green:814098229712781313> Ascii")
                    .setDescription("Tekst znajduje sie w pliku")
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
                await message.reply("", { embed: embed, files: [new MessageAttachment(path, "ascii.txt")] });
                fs.unlinkSync(path);


            } else sender.create(`\`\`\`yaml\n${data}\`\`\``, "<:check_green:814098229712781313> Ascii");
        });
    }
}

module.exports = AsciiCommand;