const Ms = require("./Ms");
const moment = require("moment");
moment.locale("PL");

module.exports.check = async (message, time, key) => {
    if (message.member.permissionsLevel === 6) return false;
    const tm = await client.db.cooldowns.get(message.author.id, key);
    const timeout = Ms(time);
    if (!timeout) return false;
    if (tm && timeout - (Date.now() - tm.date) > 0) return {
        formated: Ms.parse(timeout - (Date.now() - tm.date)),
        raw: timeout - (Date.now() - tm.date),
        humanized: moment.duration(timeout - (Date.now() - tm.date)).humanize()
    };
    else return false;
};
module.exports.set = async (message, key) => {
    if (message.member.permissionsLevel === 6) return false;
    await client.db.cooldowns.set(message.author.id, key, Date.now());
    return true;
};