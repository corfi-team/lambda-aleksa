const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

//const Sender = require("../../lib/modules/Sender");

class MemCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "mem",
            },
            help: {
                description: "Wysyła losowego mema",
                usage: "<p>mem",
                category: "Zabawa"
            }
        });

    }

    async run(message) {
        const data = await client.functions.getJejaMemes(Math.floor((Math.random() * 34338) + 1));
        const element = data[Math.floor(Math.random() * data.length)];

        const buff = element.img;
        const attachment = new MessageAttachment(buff, `mem${buff.endsWith(".gif") ? ".gif" : ".png"}`);
        const embed = new MessageEmbed()
            .setColor(message.guild.settings?.colors?.done)
            .setTitle(`<:check_green:814098229712781313> ${element.title}`)
            .setDescription(`<a:upvote:825802926618050580> \`${element.rating.up}\` | <a:unvote:825802976798703646> \`${element.rating.down}\` | ❤ \`${element.favourites}\` | <a:icon_reply:825802853687099454> \`${element.comments}\``)
            .setURL(element.original)
            .attachFiles(attachment)
            .setImage(`attachment://mem${buff.endsWith(".gif") ? ".gif" : ".png"}`)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);
        message.reply(embed);

    }
}

module.exports = MemCommand;

