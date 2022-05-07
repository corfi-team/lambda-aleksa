const BaseEvent = require("../../lib/base/BaseEvent");
const { Collection } = require("discord.js");

module.exports = class antySpamEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "antySpam",
            }
        });
    }

    async run(message, { guildConf }) {
        if (message.author.bot) return;

        if (!guildConf?.antyraid?.actions?.spam?.status) return;

        if (!message.member.lastMessages) message.member.lastMessages = [];
        message.member.lastMessages.unshift(message.createdAt.getTime());
        if (message.member.lastMessages.length > 5) return message.member.lastMessages.pop();
        if (message.member.lastMessages.length < 5) return;
        if (message.member.lastMessages[0] - message.member.lastMessages[message.member.lastMessages.length - 1] <= guildConf?.antyraid?.actions?.spam?.time || 2500) {
            message.member.lastMessages = [];
            message.channel.messages.fetch({ limit: 100 }).then(async (messages) => {
                const arr = messages.array();
                const msgs = new Collection();
                for (const i in arr) {
                    if (typeof arr[i] === "function") continue;
                    if (msgs.size >= 5) break;
                    if (arr[i]?.author?.id === message.author.id) msgs.set(arr[i].id, messages.get(arr[i].id));
                }
                if (msgs.size === 0) return;
                const msg = await message.channel.bulkDelete(msgs).catch(() => null);
                if (msg.size) await message.channel.send(guildConf?.antyraid?.actins?.spam?.message || `<@!${message.author.id}>, nie spam! Wysłałeś zbyt dużo wiadomości w krótkim czasie.`).then((msg) => msg.delete({ timeout: 5000 }));
            });
        } else {
            message.member.lastMessages = [];
        }
    };
};