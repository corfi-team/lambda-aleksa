const BaseEvent = require("../../lib/base/BaseEvent");
const fs = require("fs");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const moment = require("moment");
moment.locale("PL");

class messageDeleteEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "messageDelete",
                discord: "messageDelete"
            }
        });
    }

    async run(message) {
        if (!message.guild || !message.author || message.author.bot) return;
        const guildConf = await client.db.servers.get(message.guild.id);

        if (!guildConf.logs.channel || !guildConf.logs.status) return;
        if (message.partial) await message.fetch();
        const out = client.channels.cache.get(guildConf.logs.channel);
        let msgContent = message.content || "Wiadomość zawiera embed";
        let files = [];
        if (msgContent.length > 1047) {
            const path = `./cache/${Math.randomInt(1, 999999)}_logs_delete_${message.guild.id}.txt`;

            await fs.writeFileSync(path, msgContent);

            msgContent = "Wiadomość znajduje sie w pliku";

            files.push(new MessageAttachment(path, "logs.txt"));
            setTimeout(() => fs.unlinkSync(path), 1000);
        }
        const embed = new MessageEmbed()
            .setColor(guildConf?.colors?.done)
            .setTitle("<:icon_msg_rm:724362248989966346> Usunięcie wiadomości")
            .addField("Autor:", `${message.author.username} (\`${message.author.id}\`)`)
            .addField("Kanał:", `${message.channel}`)
            .setThumbnail(message.author.displayAvatarURL(ImageURLOptions))
            .addField("Data wysłania wiadomości", `\`${moment(message.createdAt).format("LLLL")}\` (\`${moment(message.createdAt).fromNow()}\`)`)
            .addField(`Treść wiadomości`, `${msgContent}`)
            .addField("Pliki:", `${message.attachments.map(x => x.proxyURL).join("\n") || "Brak"}`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .addField(`ID:`, `[${message.id}](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);

        if (out) out.send("", { embed: embed, files: files });
    }
}

module.exports = messageDeleteEvent;
