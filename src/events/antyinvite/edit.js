const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");
module.exports = class messageEditEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "antyinviteEdit",
                discord: "messageUpdate",
            }
        });
    }

    async run(oldMessage, message) {
        if (message.partial) await message.fetch().catch(() => {
        });
        if (!message.author || !message.member) return;
        if (oldMessage.partial) await oldMessage.fetch().catch(() => {
        });
        if (message.author.partial) await message.author.fetch().catch(() => {
        });
        if (message.member.partial) await message.member.fetch().catch(() => {
        });
        const guildConf = await client.db.servers.get(message.guild.id);
        if (guildConf.antyinvite?.status && !message.member.roles.cache.some(x => guildConf.antyinvite.roles.includes(x)) && !guildConf.antyinvite.channels.includes(message.channel.id) && !guildConf.antyinvite.users.includes(message.author.id)) {
            const perms = await client.functions.getPerms(message);
            if (perms >= 3) return;
            const regex = /(discord.com\/invite|s?:\/\/discord.gg\/)|discord(?:app.com\/invite|.gg)/g;

            if (regex.test(message.content)) {
                message.delete({ timeout: 500 });
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setTitle("Próba reklamy!")
                    .setDescription(`Użytkownik ${message.author.tag} napisał odnośnik do discorda`)
                    .setColor("RED");
                message.channel.send(embed);
            }
        }
    }
};