const { readdirSync } = require("fs");
//const cmdsCategories = ["Giveaways", "Narzędzia", "Zabawa", "Konfiguracyjne", "Administracyjne", "Deweloperskie", "Bot"];
module.exports.registerCommands = () => {

    for (const dir of readdirSync("./src/commands/")) {
        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"));

        for (const file of commands) {
            const pull = require(`../../commands/${dir}/${file}`);
            try {
                const cmd = new pull();
                //if (!cmdsCategories.includes(cmd.help.category)) console.log(`${dir}/${file}`)
                cmd.conf.fileName = `${dir}/${file}`;
                client.commands.set(cmd.conf.name, cmd);
            } catch {
                client.Logger.warn(`Cannot load command ${dir}/${file}`);
            }
        }
    }
};
module.exports.registerEvents = () => {
    for (const dir of readdirSync("./src/events/")) {
        const commands = readdirSync(`./src/events/${dir}/`).filter(file => file.endsWith(".js"));

        for (const file of commands) {
            const pull = require(`../../events/${dir}/${file}`);
            try {
                const ev = new pull();
                ev.conf.fileName = `${dir}/${file}`;

                client.events.set(ev.conf.name, ev);
                if (ev.conf.discord) {
                    if (ev.conf.discord === "ready") client.once(ev.conf.discord, (... args) => client.events.get(ev.conf.name).run(... args).catch(error => {
                        client.webhooks.error(error, {}, "event", ev.conf.name);
                    }));
                    else client.on(ev.conf.discord, (... args) => ev.run(... args).catch(error => {
                        client.webhooks.error(error, {}, "event", ev.conf.name);
                    }));
                }
            } catch {
                client.Logger.warn(`Cannot load event ${dir}/${file}`);
            }
        }
    }
};
