const BaseEvent = require("../../lib/base/BaseEvent");
const Sender = require("../../lib/modules/Sender");

module.exports = class WebhookCreateevent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "levelingInit",
            }
        });
    }

    async run(message, { guildConf }) {
        if (!guildConf.leveling?.status) return;
        const userData = await client.db.leveling.get(message.guild.id, message.author.id);

        const random = Math.floor(Math.random() * 7) + 5;

        await client.db.leveling.update(message.guild.id, message.author.id, {
            xp: userData?.xp + random
        });

        function replaceVars(str) {
            return str
                .replace(/{guild}/g, message.guild.name)
                .replace(/{guild.members}/g, message.guild.memberCount)
                .replace(/{guild.id}/g, message.guild.id)
                .replace(/{user}/g, `<@${message.author.id}>`)
                .replace(/{user.username}/g, message.author.username)
                .replace(/{user.tag}/g, message.author.tag)
                .replace(/{user.id}/g, message.author.id)
                .replace(/{level}/g, userData.level + 1)
                .replace(/{xp}/g, userData?.xp + random);
        }

        if (Array.isArray(guildConf.leveling.roles)) {
            const filtred = guildConf.leveling.roles.filter(x => x.level <= userData.level);
            for (const role of filtred) await message.member.roles.add(role.roleid).catch(() => {
            });
        }
        const xpNeeded = (userData.level === 0 ? 150 : guildConf.leveling.xpNeeded * userData.level);
        if (xpNeeded < userData.xp) {
            await client.db.leveling.update(message.guild.id, message.author.id, {
                xp: userData.xp - xpNeeded,
                level: userData.level + 1,
            });
            const lvlSettings = guildConf.leveling;
            const sender = new Sender(message);
            switch (lvlSettings.messageNewLevelType) {
                case "dm": {
                    return message.member.send(replaceVars(guildConf.leveling.messageNewLevel)).catch(() => {
                        return message.reply(replaceVars(guildConf.leveling.messageNewLevel));
                    });
                }
                case "msgChannel": {
                    if (guildConf.leveling.embed) return sender.create(replaceVars(guildConf.leveling.messageNewLevel), "Nowy poziom!");
                    else return message.reply(replaceVars(guildConf.leveling.messageNewLevel));
                }
                case "channel": {
                    const channel = message.guild.channels.cache.get(lvlSettings.messageNewLevelChannel);
                    if (channel) return channel.send(replaceVars(guildConf.leveling.messageNewLevel));
                    if (guildConf.leveling.embed) return sender.create(replaceVars(guildConf.leveling.messageNewLevel));
                    return message.channel.send(replaceVars(guildConf.leveling.messageNewLevel));
                }
                default:
                    if (guildConf.leveling.embed) sender.create(replaceVars(guildConf.leveling.messageNewLevel), "Nowy poziom!");
                    else message.reply(replaceVars(guildConf.leveling.messageNewLevel), "Nowy poziom");
            }
        }
    }
};