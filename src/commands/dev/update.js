const BaseCommand = require("../../lib/base/BaseCommand");
const { execSync } = require("child_process");
const Sender = require("../../lib/modules/Sender");

class UpdateCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "update",
                permissionLevel: 6
            },
            help: {
                description: "Updatuje bota",
                usage: "<p>update",
                category: "Deweloperskie"
            }
        });
    }

    async run(message) {
        const sender = new Sender(message);
        let out;
        try {
            out = await execSync("git fetch && git pull");
        } catch (err) {
            return sender.error(`\`\`\`yaml\n${err.stack}\`\`\``);
        }
        if (out.includes("Already up to date.")) return sender.warn("Nie pojawiły sie żadne aktualizacje!");
        sender.create(`\`\`\`\n${out}\`\`\``, "Zaktualizowano");
    }

}

module.exports = UpdateCommand;