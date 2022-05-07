const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("PL");

module.exports = class VerifyEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "guildMemberAdd",
                discord: "guildMemberAdd"
            }
        });
    }

    async run(member) {
        if (member.bot || !member.guild) return;
        const guildConf = await client.db.servers.get(member.guild.id);
        if (!guildConf.verification?.status || !guildConf.verification?.channel || !guildConf.verification?.roles?.add) return;

        const verifyEmbed = new MessageEmbed()
            .setTitle("<a:protection:717335658238050334> Weryfikacja")
            .setDescription(`Witaj ${member}. Na tym serwerze jest wymagana weryfikacja. Użyj komendy \`${guildConf.prefixes[0]}verify\` by przejść weryfikacje.`)
            .setColor("GREEN")
            .setThumbnail(member.user.displayAvatarURL(ImageURLOptions))
            .setFooter(`Weryfikacja | ${member.id}`);

        const channel = client.channels.cache.get(guildConf.verification?.channel);

        if (!channel) return;

        channel.send(`<@${member.id}>`).then(x => x.delete({ timeout: 500 }));
        channel.send(verifyEmbed);
    }
};