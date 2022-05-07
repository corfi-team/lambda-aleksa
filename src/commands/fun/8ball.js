const { MessageEmbed } = require("discord.js");

const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

const answers = [
    "Tak!",
    "Nie. ",
    "Prawda.",
    "Fałsz.",
    "Nie wiem.",
    "Może...",
    "Chyba...",
    "Chyba tak!",
    "Chyba nie!",
    "Myślę, że nie!",
    "Myślę, że tak!",
    "Oczywiście, że tak!",
    "Oczywiście, że nie!",
    "Masz rację!",
    "Nie masz racji.",
    "Dowiesz się wkrótce...",
    "Takie pytania to nie mi zadawaj",
    "Za kogo ty się masz?",
    "Ojoj. Mózg mi się przegrał!",
    "Nie wiem. Zapytaj wujka Google.",
    "Dowiesz się w swoim czasie.",
    "Moje źródła wiedzy mówią nie.",
    "Moje źródła wiedzy mówią tak.",
    "Ehh. Bez komentarza."
];

class EightballCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "8ball",
                aliases: ["eightball"],
            },
            help: {
                description: "Przewiduje przyszłość.",
                usage: "<p>8ball <Pytanie>",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args }) {
        const sender = new Sender(message);

        const text = args.join(" ");
        if (!text) return sender.warn("Niepoprawny argument \`<Pytanie>\`. Musisz zadać pytanie, na które bot odpowie.");
        if (text.length > 1024) return sender.warn("Niepoprawny argument \`<Pytanie>\`. Tekst nie może byc dłuższy niż 1024 znaki.");

        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL(ImageURLOptions))
            .setFooter(client.footer, client.user.displayAvatarURL())
            .addField("Pytanie", text)
            .setThumbnail("https://cdn.discordapp.com/attachments/777618091621875779/820056872588410880/8-Ball_Pool.svg.png")
            .addField("Odpowiedź", `\`\`\`${answers[Math.floor((Math.random() * answers.length))]}\`\`\``);
        message.reply(embed);
    }
}

module.exports = EightballCommand;