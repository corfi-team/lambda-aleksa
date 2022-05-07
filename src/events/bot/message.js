const BaseEvent = require("../../lib/base/BaseEvent");
const Sender = require("../../lib/modules/Sender");
const { MessageEmbed, Collection } = require("discord.js");
const ImageURLOptions = { dynamic: true, size: 1024, type: "png" };
const perms = {
    1: "1: Użytkownik",
    2: "2: Pomocnik",
    3: "3: Moderator",
    4: "4: Administator",
    5: "5: Właściciel serwera",
    6: "6: Programista"
};
const cooldowns = new Collection();
module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super({
            conf: {
                name: "message",
                discord: "message",
            }
        });
    }

    async run(message) {
        if (message.author.bot || !message.guild || !message.member) return;
        const guildConf = await client.db.servers.get(message.guild.id);
        if (!guildConf) return;

        await client.events.get("webhookInit").run(message.guild, message.channel);

        message.guild.settings = guildConf;
        const sender = new Sender(message);
        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`, "g");
        const prefixes = guildConf?.prefixes;
        const prefix = prefixes.find((p) => message.content.startsWith(p));
        if (message.content.match(prefixMention)) message.reply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor("GREEN")
            .setDescription("Witaj! Cieszymy się że bot Delover Ciebie zainteresował, jeśli chcesz zobaczyć listę moich funkcji, użyj komendy `" + guildConf.prefixes[0] + "help`")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .addField("» Prefixy", "> " + guildConf.prefixes.join(" | "), true)
            .addField("» Twórcy", `> [${client.users.cache.get("423494758862946324").tag}](https://discord.com/users/435029733344804874)\n> [${client.users.cache.get("375247025643716609").tag}](https://discord.com/users/375247025643716609)`, true)
        );

        message.member.permissionsLevel = await client.functions.getPerms(message);

        if (guildConf.antyinvite?.status && !message.member.roles.cache.some(x => guildConf.antyinvite.roles.includes(x)) && !guildConf.antyinvite.channels.includes(message.channel.id) && !guildConf.antyinvite.users.includes(message.author.id)) {
            const ev = await client.events.get("antyinviteInit").run(message);
            if (!ev) return;
        }

        // levels
        if (!prefix) {
            await client.events.get("levelingInit").run(message, { guildConf });
            // await client.events.get("antyraidInit").run(message, {guildConf});
        }

        // Proposals
        if (!prefix && guildConf.proposals?.status && guildConf.proposals?.channels) await client.events.get("proposalCreate").run(message, { guildConf });
        ///*if (!prefix && guildConf.memes?.status && guildConf.memes?.channel)*/ await client.events.get("memeInit").run(message, {guildConf});

        const gban = await client.db.gbans.get(message.author.id);

        const gbanCheck = () => {
            const embedGban = new MessageEmbed()
                .setTitle("<:RedFlag:708255358035951617> Global Ban")
                .setDescription("Posiadasz globalbana, nie możesz używać komend. Wiecej informacji znajdziesz na [serwerze support](https://discord.com/invite/nE9BtwXVUW)")
                .addField("Developer", `${client.users.cache.get(gban?.developer)?.tag || "Nie znaleziono"} (\`${gban?.developer}\`)`)
                .addField("Powód", gban.reason)
                .setColor("RED")
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions));
            message.reply(embedGban);
        };

        /* Autoresponders */

        const responders = await client.db.autoresponders.use(message.guild.id, message.content);
        for (const res of responders) message.reply(res.reply);

        //Cmds
        if (!prefix) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.conf.aliases && cmd.conf.aliases.includes(commandName));
        if (!command) return;

        if (command.disabled && message.member.permissionsLevel !== 6) return sender.error(`Komenda wyłączona! Nie możesz jej użyć`, "<:check_red:814098202063405056> Komenda wyłączona",);

        // Cooldowns
        if (gban) return gbanCheck();

        if (message.member.permissionsLevel !== 6) {
            if (!cooldowns.has(command.conf.name)) cooldowns.set(command.conf.name, new Collection());

            const timestamps = cooldowns.get(command.conf.name);
            const cooldownAmount = 2 * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (Date.now() < expirationTime) {
                    const timeLeft = (expirationTime - Date.now()) / 1000;
                    return sender.error(`Poczekaj \`${timeLeft.toFixed(1)}s\` przed wykonaniem tej komendy`, "<:icon_slowmode:705076491326849135> Cooldown");
                }
            }

            timestamps.set(message.author.id, Date.now());
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.help.category === "Prywatne" && message.member.permissionsLevel !== 6) return;

        if (message.member.permissionsLevel < command.conf.permissionLevel) return sender.error(`Wymagane uprawnienia: \`${perms[command.conf.permissionLevel]}\`\nTwoje uprawnienia: \`${perms[message.member.permissionsLevel]}\``, "<:check_red:814098202063405056> Nie posiadasz wystarczających permisji!");

        const flags = [];
        while (args[0] && args[0][0] === "-") flags.push(args.shift().slice(1));


        await command.run(message, { args, flags, guildConf, prefix }).catch(async (error) => {
            if (message.member.permissionsLevel === 6) {
                const embed = new MessageEmbed()
                    .setTitle("<:check_red:814098202063405056> Błąd!")
                    .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions));
                message.reply(embed);
            } else {
                /*
                const embed = new MessageEmbed()
                    .setTitle("<:check_red:814098202063405056> Błąd!")
                    .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                */
                client.webhooks.error(error, message, "command", command.conf.name);
                const embed2 = new MessageEmbed()
                    .setTitle("<:check_red:814098202063405056> Błąd!")
                    .setDescription(`Wystąpił błąd podczas wykonywania twojego polecenia. Został on automatycznie zgłoszony do developerów i zostanie szybko naprawiony. Jeśli błąd wystąpił podczas użycia ważnej dla ciebie funkcji, dołącz na [serwer developerski](http://discord.gg/XG2b7VCMKe) `)
                    .setColor("RED")
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions));
                message.reply(embed2);
            }
        });
        if (client.config.settings.node === "production") client.webhooks.commandLog(command.conf.name, args, message);
    }
};
