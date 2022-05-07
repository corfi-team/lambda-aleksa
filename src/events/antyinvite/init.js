const BaseEvent = require("../../lib/base/BaseEvent");
const { MessageEmbed } = require("discord.js");

module.exports = class antyinviteEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "antyinviteInit",
            }
        });
    }

    async run(message) {
        if (message.member.permissionsLevel >= 3) return true;
        if (message.partial) await message.fetch().catch(() => {
        });
        if (!message.author) return;
        if (message.author.partial) await message.author.fetch().catch(() => {
        });
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
            return false;
        } else return true;


    }
};