const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");

class NakladkaCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "nakladka",
                aliases: ["overlay"],
                disabled: true
            },
            help: {
                description: "Daje ci nakladke tak o",
                usage: "<p>nakladka [@User]",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args, prefix }) {
        message.channel.startTyping();
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const canvas = Canvas.createCanvas(1000, 1000);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(member.user.displayAvatarURL({
            dynamic: true,
            format: "jpg",
            size: 2048
        }));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage("./src/lib/canvas/images/delover_nakladka.png");
        ctx.drawImage(avatar, 0, 0, 1000, 1000);

        message.reply(
            new MessageAttachment(
                canvas.toBuffer(),
                "delover.jpg"
            )
        );
        await message.channel.stopTyping(1);
    }
}

module.exports = NakladkaCommand;