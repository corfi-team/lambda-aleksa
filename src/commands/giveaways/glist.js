const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const ReactionPageMenu = require("../../lib/modules/ReactionPageMenu");

/*
    guildid: guildID,
    messageid: messageID,
    channelid: channelID,
    reaction: reaction,
    ended: ended,
    winners: winners,
    end: end,
    prize: prize,
    author: authorID
*/
class GstartCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "glist",
                aliases: ["giveawaylist"],
                permissionLevel: 4
            },
            help: {
                description: "Lista giveawayów",
                usage: "<p>glist",
                category: "Giveaways",
            }
        });
    }

    async run(message) {
        const sender = new Sender(message);
        const giveaways = await client.db.giveaways.list(message.guild.id);

        const formatedGiveaways = giveaways.filter(x => x.ended === false).chunk(5);

        if (!formatedGiveaways.length) return sender.warn("Na tym serwerze nie ma losowań");
        const embeds = [];
        let int = 0;
        for (const giveawaysList of formatedGiveaways) {
            const embed = new MessageEmbed()
                .setTitle("<:check_green:814098229712781313> Lista losowań")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`)
                .setColor(message.guild.settings?.colors?.done);

            for (const giv of giveawaysList) {
                int++;
                embed.addField(`Giveaway ${int}`, `Nagroda: \`${giv.prize}\`\nLiczba zwycięzców: \`${giv.winners}\`\nData zakończenia: \`${new Date(giv.end).toLocaleString()}\n\`Autor: <@${giv.author}>\nKanał: <#${giv.channelid}>\nID: \`${giv.messageid}\`\nLink: [klik](http://discord.com/channels/${giv.guildid}/${giv.channelid}/${giv.messageid})`);
            }
            embeds.push(embed);
        }

        new ReactionPageMenu({
            message: message,
            channel: message.channel,
            userID: message.author.id,
            pages: embeds
        });
    }
}

module.exports = GstartCommand;