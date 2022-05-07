const { readFileSync } = require("fs");


// const tokens = {
//     bot: process.env.TOKENS_BOT,
//     api_alexflipnote: process.env.TOKENS_API_ALEXFLIPNOTE
// };
// const perms = {
//     developer: ["423494758862946324", '375247025643716609', '410888510044897281']
// };
// module.exports = {
//     tokens,
//     perms
// };
const conf = {};

class Config {
    constructor(path = "./.env") {
        const file = readFileSync(path, "utf-8").split(/\r?\n/g);
        for (const env of file) {
            if (!env || env.startsWith("#")) continue;
            const string = env.split("=");
            conf[string[0]] = string[1];
        }
    }

    get tokens() {
        return {
            main: conf.TOKENS_BOT,
            apis: {
                alexflipnote: conf.TOKENS_API_ALEXFLIPNOTE
            }
        };
    }

    get dashboard() {
        return {
            clientID: conf.DASHBOARD_CLIENTID,
            secret: conf.DASHBOARD_CLIENTSECRET,
            port: conf.DASHBOARD_PORT,
            redirects: {
                main: conf.DASHBOARD_REDIRECT,
                add: conf.DASHBOARD_ADDREDIRECT
            }
        };
    }

    get database() {
        return null;
    }

    get settings() {
        return {
            node: conf.NODE_ENV,
            debug: conf.DEBUG === "true"
        };
    }

    get perms() {
        return {
            developer: [/* Aleks */"423494758862946324", /*Dawid*/ "375247025643716609"]
        };
    }
}

module.exports = Config;