const BaseEvent = require("../../lib/base/BaseEvent");
const fs = require("fs");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = class WelcomeEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "massDelete",
                discord: "messageDeleteBulk",
            }
        });
    }

    async run(messages) {
        const message = messages.first();
        if (!message.guild) return;
        const guildConf = await client.db.servers.get(message.guild.id);
        if (!guildConf.logs.status) return;
        const formatedMessages = messages.filter(m => m.author && !m.author.bot);
        if (!formatedMessages.size) return;
        let content = `Serwer: ${message.guild.name}\nKanał: ${message.channel.name}\nIlość usuniętych wiadomości: ${formatedMessages.array().length}\n\n\n`;
        let i = 0;
        formatedMessages.forEach(msg => {
            i++;
            content += `Wiadomość #${i}\nID wiadomości: ${msg.id}\nTreść wiadomości: ${msg.content}\nAutor wiadomości: ${msg.author?.tag} (${msg.author?.id})\n\n`;
        });

        const channel = client.channels.cache.get(guildConf.logs.channel);
        if (!channel) return;
        const path = `./cache/${Math.randomInt(1, 999999)}_logs_massdelete_${message.guild.id}.txt`;

        await fs.writeFileSync(path, content);
        const embed = new MessageEmbed()
            .setColor(guildConf?.colors?.done)
            .setTitle("<:icon_msg_rm:724362248989966346> Usunięcie wielu wiadomości")
            .setDescription(`Kanał: ${message.channel}\nWiadomości znajdują sie w pliku`)
            .setFooter(client.footer, client.user.displayAvatarURL());
        await channel.send("", { embed: embed, files: [new MessageAttachment(path, "logs.txt")] });
        setTimeout(() => fs.unlinkSync(path), 1000);
    }
};