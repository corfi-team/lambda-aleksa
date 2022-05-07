const moment = require("moment");
moment.locale("PL");
const chalk = require("chalk");

class Logger {
    static log(content, type = "log") {
        const timestamp = `${moment().format("HH:mm:ss")}`;
        switch (type) {
            case "log": {
                return console.log(`[${chalk.green(timestamp)}]: ${content}`);
            }
            case "warn": {
                return console.log(`[${chalk.yellow(timestamp)}]: ${content}`);
            }
            case "error": {
                return console.log(`[${chalk.red(timestamp)}]: ${content}`);
            }
            case "debug": {
                return console.log(`[${chalk.blue(timestamp)}]: ${content}`);
            }
            case "info": {
                return console.log(`[${chalk.green(timestamp)}]: ${content}`);
            }
            default:
                throw new TypeError("Logger type must be either warn, debug, log, info or error.");
        }
    }

    static error(content) {
        return Logger.log(content, "error");
    }

    static warn(content) {
        return Logger.log(content, "warn");
    }

    static debug(content) {
        return Logger.log(content, "debug");
    }

    static info(content) {
        return Logger.log(content, "info");
    }
}

module.exports = Logger;