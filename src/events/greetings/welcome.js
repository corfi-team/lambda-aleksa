const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");

module.exports = class WelcomeEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "welcome",
                discord: "guildMemberAdd",
            }
        });
    }

    async run(member) {

        await member.fetch().catch(() => {
        });

        const replaceVars = (str) => {
            return str
                .replace(/{guild}/g, member.guild.name)
                .replace(/{guild.members}/g, member.guild.members.cache.filter((m) => !m?.user?.bot).size)
                .replace(/{guild.id}/g, member.guild.id)
                .replace(/{user}/g, `<@${member.id}>`)
                .replace(/{user.username}/g, member.user.username)
                .replace(/{user.tag}/g, member.user.tag)
                .replace(/{user.id}/g, member.user.id);
        };

        const guildConf = await client.db.servers.get(member.guild.id);
        if (!guildConf.welcome?.status) return;
        const embed = new MessageEmbed()
            .setTitle(replaceVars(guildConf.welcome.title || ""))
            .setColor(guildConf.welcome.color)
            .setDescription(replaceVars(guildConf.welcome.message) || "")
            .setThumbnail(member.user.displayAvatarURL(ImageURLOptions));
        const ch = client.channels.cache.get(guildConf.welcome.channel);
        if (ch) {
            ch.send(embed);
            if (guildConf.welcome.message.includes("{user}")) ch?.send(`[ Oznaczenie ] <@${member.id}>`).then(x => x.delete({ timeout: 500 }));
        }
    };
};