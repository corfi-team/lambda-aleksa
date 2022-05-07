const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const r = require("rethinkdb");
const os = require("os");
const moment = require("moment");
moment.locale("PL");
const osu = require("node-os-utils");
const platforms = {
    win32: "Windows",
    linux: "Linux",
    android: "Android",
    sunos: "Sunos",
    openbsd: "OpenBSD",
    freebsd: "FreBSD",
    aix: "AIX",
    darwin: "Darwin"
};
const { formatSizeUnits } = require("../../lib/functions");

class StatsCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "stats",
                aliases: ["staty", "statystyki", "botinfo"],
            },
            help: {
                description: "Pokazuje statystyki bota i bazy danych",
                usage: "<p>ping",
                category: "Bot",
            }
        });
    }

    async run(message, { prefix, args }) {
        message.channel.startTyping();
        if (args[0] === "db") {
            const tables = await r.tableList().run(client.db.conn);
            if (args[1] && tables.includes(args[1])) {
                const tableInfo = await r.db("rethinkdb").table("stats").coerceTo("array").run(client.db.conn);
                const filtred = tableInfo.filter(x => x.db === "Delover" && x.table === args[1])[1];
                const embed = new MessageEmbed()
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setColor(message.guild.settings?.colors?.done)
                    .setTitle("<:check_green:814098229712781313> Informacje o tabeli")
                    .setDescription(`Odczytywane dokumenty na sekunde: \`${filtred.query_engine.read_docs_per_sec}\`\nOdczytywane dokumenty ogólnie: \`${filtred.query_engine.read_docs_total}\`\nZapisywane dokumenty na sekunde: \`${filtred.query_engine.written_docs_per_sec}\`\nZapisywane dokumenty ogólnie: \`${filtred.query_engine.written_docs_total}\`\nZajmowane miejsce na dysku: \`${formatSizeUnits(filtred.storage_engine.disk.space_usage.data_bytes)}\``);
                message.reply(embed);
                message.channel.stopTyping(1);
            } else {
                const embed = new MessageEmbed()
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setColor(message.guild.settings?.colors?.done)
                    .setTitle("<:check_green:814098229712781313> Informacje o bazie danych")
                    .setDescription(`Ilość tabeli: \`${tables.length}\`\nLista tabeli: ${tables.map(x => `\`${x}\``).join(", ")}\n\nBy zobaczyć informacje o tabeli wpisz \`${prefix}stats db <tabela>\``);
                message.reply(embed);
                message.channel.stopTyping(1);
            }
        } else {
            const procent = await osu.cpu.usage();
            const embed = new MessageEmbed()
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .setColor(message.guild.settings?.colors?.done)
                .setTitle("<:check_green:814098229712781313> Statystyki")
                .setDescription(`By zobaczyc statystyki bazy wpisz: \`${prefix}stats db\``)

                .addField("Node.js", `\`${process.version}\``)
                .addField("Discord.js", `\`v${require("discord.js").version}\``)
                .addField("Wersja bota", `\`${client.version}\``)

                .addField("Użycie CPU", `\`${procent.toFixed(2)}%\``)
                .addField("Użycie RAM", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} MB / ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB\``)
                .addField("System", `\`${platforms[os.platform()]}\``)

                .addField("Procesor", `\`${os.cpus().map((i) => i.model)[0]}\``)
                .addField("Arch", `\`${os.arch()}\``)
                .addField("Uptime", `\`${moment.duration(client.uptime).humanize()}\``)

                .addField("Serwery", `\`${client.guilds.cache.size}\``)
                .addField("Użytkownicy", `\`${client.users.cache.size}\``)
                .addField("Shardy", `\`${client.ws.shards.size}\``)
                .addField("Kanały", `\`${client.channels.cache.size}\``);
            message.reply(embed);
            message.channel.stopTyping(1);
        }
    }
}

module.exports = StatsCommand;