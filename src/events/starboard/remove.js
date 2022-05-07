const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
module.exports = class messageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "starboardRemove",
                discord: "messageReactionRemove",
            }
        });
    }

    async run(reaction) {
        if (reaction.partial) await reaction.fetch().catch(() => {
        });

        const message = reaction.message;
        if (message.partial) await message.fetch().catch(() => {
        });

        const guildConf = await client.db.servers.get(message.guild.id);
        if (!guildConf.starboard.status) return;
        if (reaction.emoji.name !== guildConf.starboard.emoji) return;
        if (!guildConf.starboard.channel) return;
        const dbGet = await client.db.starboard.get(message.guild.id, message.id);
        if (!dbGet) return;
        if (reaction.count < guildConf.starboard.reactionCount) {
            client.db.starboard.remove(message.guild.id, message.id).catch(() => {
            });

            const channel = client.channels.cache.get(guildConf.starboard.channel);

            if (!channel) return;

            const existingMsg = await channel.messages.fetch(dbGet.embedmessageid).catch(() => {
            });
            if (!existingMsg) return;
            existingMsg.delete({ timeout: 500 });
        } else {
            client.db.starboard.update(message.guild.id, message.id, {
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