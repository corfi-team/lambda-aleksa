const BaseEvent = require("../../lib/base/BaseEvent");
const { Permissions } = require("discord.js");
// const Sender = require("../../lib/modules/Sender");

module.exports = class WebhookCreateevent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "webhookInit",
            }
        });
    }

    async run(guild, channel) {
        try {
            if (guild.me.hasPermission("MANAGE_WEBHOOKS")) {
                const allwebhooks = await guild.fetchWebhooks().catch(() => {
                });
                const webhook = await allwebhooks?.find(r => r?.name === "DeloverBOT Webhooks");
                if (!webhook) {
                    guild.webhook = await channel?.createWebhook("DeloverBOT Webhooks", {
                        avatar: "https://delover.xyz/assets/delover.png",
                        reason: "Potrzebny webhook do komend i systemów"
                    });
                } else guild.webhook = webhook;

                guild.webhook.setChannel = async (channele) => {
                    if (channel.id === guild.webhook.channelID) return (guild.webhook);
                    return await guild.webhook.edit({
                        channel: channele
                    });
                };
            } else guild.webhook = null;

        } catch {
        }
    }
};