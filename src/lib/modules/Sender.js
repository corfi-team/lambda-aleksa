const { MessageEmbed } = require("discord.js");

class Sender {
    constructor(message) {
        this.message = message;
        this.colors = message.guild.settings.colors;
    }

    async create(text = "", title = "<:check_green:814098229712781313> Gotowe", footer = "", color = this?.colors?.done) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(text)
            .setFooter(footer)
            .setColor(color)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(this.message.author.tag, this.message.author.displayAvatarURL(ImageURLOptions));
        return await this.message.reply(embed);
    }

    async warn(text = "", title = "<:warn2:788533529285492736> Ostrzeżenie", footer = "", color = this?.colors?.warn) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(text)
            .setFooter(footer)
            .setColor(color)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(this.message.author.tag, this.message.author.displayAvatarURL(ImageURLOptions));
        return await this.message.reply(embed);
    }

    async error(text = "", title = "<:check_red:814098202063405056> Błąd", footer = "", color = this?.colors?.error) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(text)
            .setFooter(footer)
            .setColor(color)
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(this.message.author.tag, this.message.author.displayAvatarURL(ImageURLOptions));
        return await this.message.reply(embed);
    }

}

module.exports = Sender;