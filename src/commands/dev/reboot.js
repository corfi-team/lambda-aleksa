const BaseCommand = require("../../lib/base/BaseCommand");

class RebootCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "reboot",
                aliases: ["rb"],
                permissionLevel: 6
            },
            help: {
                description: "Restartuje bota",
                usage: "<p>reboot",
                category: "Deweloperskie"
            }
        });
    }

    async run() {
        process.exit(69 * 2137);
    }

}

module.exports = RebootCommand;