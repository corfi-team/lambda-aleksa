module.exports = class BaseCommand {
    constructor({
                    conf: {
                        name = null,
                        permissionLevel = 1,
                        aliases = [],
                        disabled = false,
                        botPerm = "SEND_MESSAGES"
                    },
                    help: {
                        description = "Nie podano",
                        usage = "Nie podano",
                        category = "Nie podano",
                        flags = "Brak"
                    }
                }) {
        this.conf = {
            name,
            fileName: null,
            permissionLevel,
            aliases,
            disabled,
            botPerm
        };
        this.help = {
            description,
            usage,
            category,
            flags
        };
    };

    async reload() {
        const filename = this.conf.fileName;
        delete require.cache[require.resolve(`../../commands/${filename}`)];
        const file = require(`../../commands/${filename}`);
        const newCommand = new file();
        newCommand.conf.fileName = filename;
        client.commands.set(newCommand.conf.name, newCommand);
        return true;
    };

    async unload() {
        return this.client.commands.delete(this.conf.name);
    };
};
