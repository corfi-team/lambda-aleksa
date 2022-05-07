const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
module.exports = class guildCreateEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "guildCreate",
                discord: "guildCreate",
            }
        });
    }

    async run(guild) {
        const guildConf = await client.db.servers.get(guild.id);
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: "BOT_ADD"
        }).catch(() => {
        });

        const member = fetchedLogs?.entries?.first()?.executor;
        client.webhooks.serverLog(guild, "Delover został dodany na nowy serwer.", "GREEN", member);
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor(member?.tag, member?.displayAvatarURL(ImageURLOptions))
            .setFooter(client.footer, client.user.displayAvatarURL(ImageURLOptions))
            .setDescription(`Witaj **${member?.username}**! Serdecznie dziękujemy za dodanie bota Delover. Poniżej znajdziesz kilka informacji, które przydadzą Ci się podczas korzystania z bota. Pozdro <3`)
            .addField("• Prefixy", `> ${guildConf.prefixes.join(" | ")}`, true)
            .addField("• Komenda pomocy", `> \`${guildConf.prefixes[0]}pomoc\``, true)
            .addField("• Dashboard", `> [\`Kliknij!\`](https://delover.xyz/dashboard/${guild.id})`)
            .addField("• Potrzebujesz pomocy?", `> Dołącz na nasz **[serwer wsparcia](https://discord.gg/vksuKWDY5k)**\n> Lub skontantuj się z administracją. Komenda: \`${guildConf.prefixes[0]}ekipa\``);
        await member?.send(embed).catch(() => {
        });
    }
};