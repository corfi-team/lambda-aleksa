const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class PollCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "poll",
                aliases: ["ankieta"],
                permissionLevel: 4,
            },
            help: {
                description: "Tworzy ankiete",
                usage: "<p>poll <pytanie> lub <tytuł> <odpowiedź 1> & <odpowiedź 2> (max 10 odpowiedzi)",
                category: "Administracyjne",

            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);

        if (!args.length) return sender.warn(`Niepoprawny argument \`<text>\`\nNie podano tekstu ankiety.\n\nPoprawne użycie 1: \`${prefix}poll <tekst>\`\n Poprawne użycie 2: \`${prefix}poll <tytuł ankiety> & <odpowiedz 1> & <odpowiedz 2> (max 10 odpowiedzi)\``);

        const reason = args.join(" ").replace(" & ", "&").split("&");
        const anserws = [... reason].slice(1);
        if (anserws.length) {
            const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

            let text = "";
            if (anserws.length > 10) return sender.warn("Liczba pozycji nie może przekraczać 10.");

            anserws.forEach((r, i) => {
                if (i === 0) text += `${emoji[i]} - ${r}`;
                if (i > 0) text += `\n${emoji[i]} - ${r}`;
            });
            const embed = new MessageEmbed()
                .setTitle(reason[0])
                .setDescription(text)
                .setColor("GREEN")
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setFooter(client.footer, client.user.displayAvatarURL());

            message.channel.send(embed).then((m) => {
                anserws.forEach(async (r, i) => {
                    await m.react(emoji[i]);
                });
            });
        } else {
            const embed = new MessageEmbed()
                .setTitle("📊 Ankieta")
                .setDescription(reason)
                .setColor("GREEN")
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setFooter(client.footer, client.user.displayAvatarURL());

            const m = await message.channel.send(embed);
            let reactions = ["814098229712781313", "814098094743486468", "814098202063405056"];
            reactions.forEach(async (x) => {
                await m.react(x);
            });
        }
    }
}

module.exports = PollCommand;