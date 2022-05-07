const { Structures, APIMessage } = require("discord.js");

Structures.extend("Message", (M) => {
    return class extends M {
        constructor(client, data, channel) {
            super(client, data, channel);
        }

        async reply(content, options) {
            const mentionRepliedUser = (options ? !!options.mention : false); //typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
            const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
            Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

            if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0) apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
            if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined") Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });

            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map((x) => {
                    x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                    return x;
                }).map(this.reply.bind(this)));
            }

            const { data, files } = await apiMessage.resolveFiles();
            return this.client.api.channels[this.channel.id].messages
                .post({ data, files })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
        };

        edit(content, options) {
            if (typeof content === "object") {
                options = { disableMentions: "all", allowedMentions: { users: [] }, embed: content };
                const { data } = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this, "", options).resolveData();
                return this.client.api.channels[this.channel.id].messages[this.id].patch({ data }).then((d) => {
                    const clone = this._clone();
                    clone._patch(d);
                    return clone;
                });
            } else {
                options = { disableMentions: "all" };
                const { data } = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this, content, options).resolveData();
                return this.client.api.channels[this.channel.id].messages[this.id].patch({ data }).then((d) => {
                    const clone = this._clone();
                    clone._patch(d);
                    return clone;
                });
            }
        };
    };
});