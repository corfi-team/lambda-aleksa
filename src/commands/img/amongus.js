const { MessageEmbed, MessageAttachment } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class AmongUsCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: `amongus`,
                fileName: `img/amongus.js`,
                aliases: ["among", "among-us"]
            },
            help: {
                description: `Tworzy obrazek z postacią among us`,
                usage: `<p>amongus <impostor (tak/nie)> <nick>`,
                category: "Obrazki",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (!args.length) return sender.warn(`Niepoprawny argument \`<impostor>\`\nNie podano impostora\n\nPoprawne użycie: \`${prefix}amongus <impostor (tak/nie)> <nick>\``);
        const nick = args.slice(1).join(" ");
        if (!nick || nick.isAscii()) return sender.warn(`Niepoprawny argument \`<nick>\`\nNie podano nicku lub zawiera on niedozwolone znaki\n\nPoprawne użycie: \`${prefix}amongus <impostor (tak/nie)> <nick>\``);
        if (nick.length > 15) return sender.warn(`Nick nie może być dłuższy niż 15 znaków`);
        let impostor = args[0];
        if (impostor !== "tak" && impostor !== "nie") return sender.warn(`Niepoprawny argument \`<impostor>\`\nPodano zły argument impostor\n\nPoprawne użycie: \`${prefix}amongus <impostor (tak/nie)> <nick>\``);
        impostor = impostor === "tak";
        const colours = [
            `black`,
            `blue`,
            `brown`,
            `cyan`,
            `darkgreen`,
            `lime`,
            `orange`,
            `pink`,
            `purple`,
            `red`,
            `white`,
            `yellow`
        ];
        const color = (Math.floor(Math.random() * colours.length));
        const image = `https://vacefron.nl/api/ejected?name=${encodeURIComponent(nick)}&imposter=${impostor}&crewmate=${colours[color]}`;

        const attachment = new MessageAttachment(image, `impostor.png`);
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> AmongUs`)
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
            .attachFiles(attachment)
            .setImage(`attachment://impostor.png`);
        message.reply(embed);
    }


}

module.exports = AmongUsCommand;