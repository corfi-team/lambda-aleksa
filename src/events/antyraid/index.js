const BaseEvent = require("../../lib/base/BaseEvent");
const actions = [
    "massMention"
];

module.exports = class antyRaidEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "antyraidInit",
            }
        });
    }

    async run(message, { guildConf }) {
        if (message.author.bot) return;

        for (const i in actions) {
            if (typeof actions[i] === "function") continue;
            /*if (guildConf.antyraid?.actions?.actions[i]?.status)*/
            client.events.get(actions[i]).run(message, { guildConf });
        }
    };
};