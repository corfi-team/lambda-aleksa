const BaseEvent = require("../../lib/base/BaseEvent");

module.exports = class snipeCreate extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "snipeCreate",
                discord: "messageDelete",
            }
        });
    }

    async run(message) {
        const snipes = message.client.snipes.get(message.channel.id) || [];
        snipes.unshift({
            content: message.content,
            author: message.author,
            image: message.attachments.first() ?
                message.attachments.first().proxyURL : null,
            date: Date.now()
        });
        snipes.splice(10);
        message.client.snipes.set(message.channel.id, snipes);
    }
};