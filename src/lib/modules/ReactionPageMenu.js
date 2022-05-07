class Menu {
    static defaultReactions = { first: "⏪", back: "⬅️", next: "➡️", stop: "⏹", last: "⏩" };

    constructor(opts = {}) {
        const {
            channel,
            userID,
            pages = [],
            page = 0,
            time = 120000,
            reactions = Menu.defaultReactions,
            message
        } = opts;
        if (!channel || !userID || !message) throw new Error("ReactionPageMenuError: not provided channel or userID or message");
        this.channel = channel;
        this.pages = pages;
        this.time = time;
        this.reactions = reactions;
        this.page = page;
        this.catch = () => {
        };
        this.message = message;
        message.reply(pages[page]).then(msg => {
            this.msg = msg;
            this.addReactions();
            this.createCollector(userID);
        }).catch(this.catch);
    }

    select(pg = 0) {
        this.page = pg;
        this.msg.edit(this.pages[pg]).catch(this.catch);
        return true;
    }

    createCollector(uid) {
        const collector = this.msg.createReactionCollector((r, u) => u.id === uid, { time: this.time });
        collector.on("collect", r => {
            switch (r.emoji.name) {
                case this.reactions.back: {
                    if (this.page !== 0) this.select(this.page - 1);
                    break;
                }
                case this.reactions.next: {
                    if (this.page < this.pages.length - 1) this.select(this.page + 1);
                    break;
                }
                case this.reactions.last: {
                    if (this.page !== this.pages.length) this.select(this.pages.length - 1);
                    break;
                }
                case this.reactions.first: {
                    if (this.page !== 0) this.select(0);
                    break;
                }
                case this.reactions.stop: {
                    collector.stop();
                    break;
                }

            }
            r.users.remove(uid).catch(this.catch);
        });
        collector.on("end", () => {
            this.msg.reactions.removeAll().catch(this.catch);
        });
    }

    async addReactions() {
        if (this.reactions.first) await this.msg.react(this.reactions.first).catch(this.catch);
        if (this.reactions.back) await this.msg.react(this.reactions.back).catch(this.catch);
        if (this.reactions.stop) await this.msg.react(this.reactions.stop).catch(this.catch);
        if (this.reactions.next) await this.msg.react(this.reactions.next).catch(this.catch);
        if (this.reactions.last) await this.msg.react(this.reactions.last).catch(this.catch);
    }
}

module.exports = Menu;