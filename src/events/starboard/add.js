const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
module.exports = class messageReactionAddEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "starboardAdd",
                discord: "messageReactionAdd",
            }
        });
    }


    async run(reaction, user) {
        const message = reaction.message;
        if (message.partial) await message.fetch().catch(() => {
        });
        if (reaction.partial) await reaction.fetch().catch(() => {
        });
        await user.fetch().catch(() => {
        });
        const guildConf = await client.db.servers.get(message.guild.id);
        if (!guildConf.starboard.status) return;
        if (reaction.emoji.name !== guildConf.starboard.emoji) return;

        if (user.id === message.author.id && guildConf.starboard.authorStar) {
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id) && reaction.emoji.name === guildConf.starboard.emoji);
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(message.author.id).catch(() => {
                });
            }
        }

        if (!guildConf.starboard.channel) return;
        const dbGet = await client.db.starboard.get(message.guild.id, message.id);
        if (!dbGet) {
            if (reaction.count < guildConf.starboard.reactionCount || message.channel.nsfw) return;

            //embed here
            const channel = client.channels.cache.get(guildConf.starboard.channel);
            if (!channel) return;
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                .addField("Link", `[Klik](${message.url})`)
                .setColor("GREEN")
                .addField("Liczba gwiazdek", `\`${reaction.count}\``)
                .addField("Kanał", message.channel)
                .setDescription(message.content || "Wiadomość zawiera embed");
            if (message.attachments.size === 1) embed.setImage(message.attachments.array()[0].url);
            const embedMessage = await channel.send(embed);


            await client.db.starboard.add(message.guild.id, message.channel.id, message.id, message.author.id, reaction.count, embedMessage.id);
        } else {
            await client.db.starboard.update(message.guild.id, message.id, {
                stars: reaction.count
            });
            const channel = client.channels.cache.get(guildConf.starboard.channel);

            if (!channel) return client.db.starboard.remove(message.guild.id, message.id);

            const existingMsg = await channel.messages.fetch(dbGet.embedmessageid).catch(() => {
            });
            if (!existingMsg || !existingMsg.embeds) return client.db.starboard.remove(message.guild.id, message.id);
            const embed = new MessageEmbed(existingMsg.embeds[0]);
            embed.fields[1].value = `\`${reaction.count}\``;
            if (existingMsg) existingMsg.edit(embed);
            else client.db.starboard.remove(message.guild.id, message.id);
        }
    }
};