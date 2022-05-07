const BaseClient = require("./lib/base/BaseClient");
const client = new BaseClient({
    /*cacheGuilds: true,
    cacheChannels: false,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false*/
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
delete require.cache[require.resolve("./lib/base/BaseClient")];

client.config = require("./lib/").config;
client.lib = require("./lib");
delete require.cache[require.resolve("./lib")];

if (client.config.settings.debug) client.on("debug", client.Logger.debug);

client.lib.init(client);

client.Logger.log(`Attempt to connect to Discord Gateway`);

client.login(client.config.tokens.main);