//const {MessageEmbed} = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");

class MemeCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "meme",
            },
            help: {
                description: "Nie ma.",
                usage: "<p>meme <view/delete>",
                category: "Narzędzia",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        const choice = args[0]?.toLowerCase();
        if (!choice) return sender.create(`
          \`${prefix}meme remove <Meme ID>\` - usuwa mema o podanym ID.
          \`${prefix}meme view <Meme ID>\` - wyświetla mema o podanym ID
          \`${prefix}meme list <@Użytkownik>\` - wyświetla wszystkie memy, które wysłał podany użytkownik.
          `, "😂 Memy");

        switch (choice) {
            case "delete":
            case "del":
            case "remove": {

            }
        }
    }
}

module.exports = MemeCommand;