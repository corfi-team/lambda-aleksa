const { Client, Message } = require("discord.js");
const moment = require("moment");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
moment.locale("PL");
const { config } = require("../lib");

function getUserFromMention(mention, opts) {
    if (!mention || !mention.includes("<@")) return null;
    if (opts instanceof Message) {
        try {
            mention = mention.replace(/^\D+/g, "");
            if (mention.endsWith(">")) mention = mention.slice(0, -1);
            return opts.guild.members.cache.get(mention) || null;
        } catch {
            return null;
        }
    } else if (opts instanceof Client) {
        try {
            mention = mention.replace(/^\D+/g, "");
            if (mention.endsWith(">")) mention = mention.slice(0, -1);
            //opts.users.fetch(mention).catch(false)

            return opts.users.cache.get(mention) || null;
        } catch {
            return null;
        }
    } else throw new TypeError("Opts must be a message or client!");
}


module.exports.getPerms = async (message) => {
    const member = message.member;
    const settings = await client.db.servers.get(message.guild.id);
    if (!member) return 1;
    let number = 1;
    if (client.config.perms.developer.includes(member.id)) return 6;
    if (member.hasPermission("MANAGE_MESSAGES") || member.hasPermission("KICK_MEMBERS") || message.member.roles.cache.some(r => !!settings.permissions.roles.find(x => x.role === r.id && x.permission === "Pomocnik"))) number++;
    if (member.hasPermission("BAN_MEMBERS") || message.member.roles.cache.some(r => !!settings.permissions.roles.find(x => x.role === r.id && x.permission === "Moderator"))) number++;
    if (member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(r => !!settings.permissions.roles.find(x => x.role === r.id && x.permission === "Administrator"))) number++;
    if (member.id === member.guild.ownerID) number++;
    return number;
};

module.exports.formatSizeUnits = function (bytes) {
    if (bytes >= 1073741824) {
        bytes = (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes > 1) {
        bytes = bytes + " B";
    } else if (bytes === 1) {
        bytes = bytes + " B";
    } else {
        bytes = "0 B";
    }
    return bytes;
};

module.exports.getGuildMember = (message, args) => {
    if (!args) return null;
    return message.guild.members.cache.get(args) || message.guild.members.cache.find(x => x.user.username === args) || getUserFromMention(args, message);
};

module.exports.fetchUser = async (message, args) => {
    if (!args) return null;
    if (client.users.cache.get(args)) return client.users.cache.get(args);
    else return await client.users.fetch(args).catch(() => {
        return false;
    });
};

module.exports.getUser = (message, args) => {
    return client.users.cache.get(args) || getUserFromMention(args, client) || client.users.cache.find(x => x.username === args);
};

module.exports.getWinners = async function (message, reactionProvided, winnerCount) {
    const guild = message.guild;
    const reactions = message.reactions.cache;
    const reaction = reactions.get(reactionProvided) || reactions.find((r) => r.emoji.name === reactionProvided);
    if (!reaction) return [];
    await guild.members.fetch();
    const users = (await reaction.users.fetch()).filter((u) => !u.bot);
    const rolledWinners = users.random(winnerCount);
    const winners = [];

    for (const u of rolledWinners) {
        const isValidEntry = !winners?.some((winner) => winner?.id === u?.id);
        if (isValidEntry) winners?.push(u);
        else {
            for (const user of users.array()) {
                const alreadyRolled = winners?.some((winner) => winner?.id === user?.id);
                if (alreadyRolled || !user) continue;
                winners?.push(user);
                break;
            }
        }
    }
    return winners.map((user) => guild.member(user) || user);
};

module.exports.resolveBool = (lang, way, bool) => {
    if (lang.toLowerCase() === "pl") {
        if (way.toLowerCase() === "yesno") {
            if (bool) return "Tak";
            else return "Nie";
        } else if (way.toLowerCase() === "truefalse") {
            if (bool) return "Prawda";
            else return "Fałsz";
        }
    } else if (lang.toLowerCase() === "en") {
        if (way.toLowerCase() === "yesno") {
            if (bool) return "Yes";
            else return "No";
        } else if (way.toLowerCase() === "truefalse") {
            if (bool) return "True";
            else return "False";
        }
    }
};


module.exports.removeUndefineds = (obj) => {
    if (obj === undefined) return null;
    if (typeof obj === "object") for (const key in obj) if (obj.hasOwnProperty(key)) obj[key] = this.removeUndefineds(obj[key]);
    return obj;
};

module.exports.getJejaMemes = async (page) => {
    const body = await fetch(`https://memy.jeja.pl/nowe,0,0,${page}.html`).then(res => res.text());
    const $ = cheerio.load(body);
    const data = [];

    $(".ob-left-box.ob-left-box-images").toArray().forEach(e => {
        try {
            const h2 = $(e).children("h2");
            const h2_a = $(h2).children("a")["0"];
            const h2_a_val = $(h2_a).children("a")["_root"]["0"]["children"][0]["data"];

            const img_div = $(e).children(".left-wrap");
            const img_div_1 = $(img_div).children(".ob-left-images");
            const img_a = $(img_div_1).children("a");
            const img = $(img_a).children("img");
            const img_link = img["0"];

            const originalPost = $(e).children("h2");
            const originalPost_a = $(originalPost).children("a");
            const originalPost_link = originalPost_a["0"]["attribs"]["href"];

            const rating = $(e).children(".left-wrap");
            const rating_box = $(rating).children(".vote-box.movie-left-ocen");
            const rating_box_1 = $(rating_box).children(".star-box");
            const rating_up = $(rating_box_1).children(".voteup");
            const rating_up_text = $(rating_up).children(".cnt_votes_up");
            const rating_up_final = rating_up_text["0"]["children"][0]["data"];
            const rating_down = $(rating_box_1).children(".votedown");
            const rating_down_text = $(rating_down).children(".cnt_votes_down");
            const rating_down_final = rating_down_text["0"]["children"][0]["data"];

            const favourites = $(e).children(".left-wrap");
            const favourites_box = $(favourites).children(".icon-m-box");
            const favourites_link = $(favourites_box).children(".ico-ulu.no-brackets.favorite");
            const favourites_text = favourites_link["0"]["children"][0];
            const favourites_final = favourites_text["next"]["children"][0]["data"];

            const comments = $(e).children(".left-wrap");
            const comments_box = $(comments).children(".icon-m-box");
            const comments_link = $(comments_box).children(".ico-kom.no-brackets");
            const comments_text = comments_link["0"]["children"][0];
            const comments_final = comments_text["children"][0]["data"];

            data.push(
                {
                    img: img_link.attribs.src,
                    title: h2_a_val,
                    rating: {
                        up: rating_up_final,
                        down: rating_down_final
                    },
                    original: originalPost_link,
                    favourites: favourites_final,
                    comments: comments_final
                }
            );
        } catch {
        }
    });

    return data;
};

if (config.settings.node === "production") {
    process.on("unhandledRejection", (reason, promise) => {
        client.webhooks.unhandledRejection(reason, promise);
    });
}