const moment = require("moment");
moment.locale("PL");
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

class StoperCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "stoper",
                aliases: ["10s", "5s", "2s"],
                fileName: "fun/stoper.js"
            },
            help: {
                desc: "Liczy czas klikniecia w reakcje",
                usage: "<p>stoper",
                category: "Zabawa"
            }
        });

    }

    async run(message) {
        const emb = new MessageEmbed()
            .setTitle("<:check_green:814098229712781313> Stoper")
            .setColor("GREEN")
            .setDescription("Kliknięto w: \`?.??s\`")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        const m = await message.reply(emb);
        await m.react("⏱").catch(() => {
        });
        const lastTime = m.createdTimestamp;

        const filter = (reaction, user) => {
            return ["⏱"].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collected = await m.awaitReactions(filter, { max: 1, time: 90000, errors: ["time"] }).catch(e => e);
        if (collected.size === 0) {
            const emd = new MessageEmbed()
                .setTitle("<:check_green:814098229712781313> Stoper")
                .setDescription(`Kliknięto w: \`${moment.duration(new Date().getTime() - lastTime, "milliseconds").asSeconds().toFixed(2)}s\``)
                .setColor("GREEN")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            return m.edit(emd);
        }
        const reaction = collected.first();
        if (reaction.emoji.name === "⏱") {
            const emd = new MessageEmbed()
                .setTitle("<:check_green:814098229712781313> Stoper")
                .setDescription(`Kliknięto w: \`${moment.duration(Date.now() - lastTime, "milliseconds").asSeconds().toFixed(2)}s\``)
                .setColor("GREEN")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
            m.edit(emd);
        }
    }


}

module.exports = StoperCommand;