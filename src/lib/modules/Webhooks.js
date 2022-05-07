const { MessageEmbed, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const platforms = {
    win32: "Windows",
    linux: "Linux",
    android: "Android",
    sunos: "Sunos",
    openbsd: "OpenBSD",
    freebsd: "FreBSD",
    aix: "AIX",
    darwin: "Darwin"
};

const os = require("os");
module.exports = {
    "error": (err, message, type, name) => {
        client.Logger.error(err.stack);
        switch (type) {
            case "command": {
                const embed = new MessageEmbed()
                    .setTitle("Błąd")
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`\`\`\`js\n${err.stack}\`\`\``)
                    .addField("Typ", "`Komenda`")
                    .addField("Komenda", `\`${name}\``)
                    .addField("Treść wiadomości", message.content.length < 1023 ? message.content : "Zbyt duze by wyświetlić")
                    .addField("ID wiadomości", `\`${message.id}\``)
                    .addField("Serwer", `${message.guild.name} (\`${message.guild.id}\`)`)
                    .addField("Autor wiadomości", `${message.author.tag} (\`${message.author.id}\`)`)
                    .setFooter(client.footer, client.user.displayAvatarURL());
                return new WebhookClient().send(embed);
            }
            case "event": {
                const embed = new MessageEmbed()
                    .setTitle("Błąd")
                    .setColor("RED")
                    .setDescription(`\`\`\`js\n${err.stack}\`\`\``)
                    .addField("Typ", "`Event`")
                    .addField("Event", `\`${name}\``);
                return new WebhookClient().send(embed);
            }
            case "www": {
                const embed = new MessageEmbed()
                    .setTitle("Błąd")
                    .setColor("RED")
                    .setDescription(`\`\`\`js\n${err.stack}\`\`\``)
                    .addField("Typ", "`Www`")
                    .addField("Endpoint", `\`${name}\``);
                return new WebhookClient().send(embed);
            }
        }
        const embed = new MessageEmbed()
            .setTitle("Błąd")
            .setColor("RED")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`js\n${err.stack}\`\`\``)
            .addField("Typ", errorTypes[type])
            .addField("Komenda", `\`${cmd}\``)
            .addField("Treść wiadomości", message.content.length < 1023 ? message.content : "Zbyt duze by wyświetlić")
            .addField("ID wiadomości", `\`${message.id}\``)
            .addField("Serwer", `${message.guild.name} (\`${message.guild.id}\`)`)
            .addField("Autor wiadomości", `${message.author.tag} (\`${message.author.id}\`)`)
            .setFooter(client.footer, client.user.displayAvatarURL());
        new WebhookClient().send(embed);
    },
    "commandLog": (cmd, args, message) => {
        const embed = new MessageEmbed()
            .setTitle("Użycie komendy")
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Komenda", `\`${cmd}\``)
            .addField("Treść wiadomości", `\`${message.content.length < 1023 ? message.content : "Zbyt duze by wyświetlić"}\``)
            .addField("Link do wiadomości", `[\`Kliknij!\`](${message.url})`)
            .addField("Serwer", `${message.guild.name} (\`${message.guild.id}\`)`)
            .addField("Autor wiadomości", `${message.author.tag} (\`${message.author.id}\`)`)
            .setFooter(client.footer, client.user.displayAvatarURL());
        new WebhookClient().send(embed);
    },
    "serverLog": async (guild, txt, color, member) => {
        const owner = await client.users.cache.get(guild.ownerID);
        if (!owner) {
            owner.tag = "Nie znaleziono";
            owner.id = "Nie znaleziono.";
        }
        const embed = new MessageEmbed()
            .setAuthor("Lambda", "https://cdn.discordapp.com/attachments/777618020415569931/814459109314134066/storm.png")
            .setColor(color)
            .addField("**Nazwa serwera**", guild.name)
            .addField("**ID serwera**", guild.id)
            .addField("**Serwery Bota**", client.guilds.cache.size)
            .setFooter(txt)
            .addField("**Liczba członków**", `**Osoby:** ${guild.members.cache.filter((m) => !m.user.bot).size}\n**Boty:** ${guild.members.cache.filter((m) => m.user.bot).size}\n**Wszyscy:** ${guild.members.cache.size}`)
            .addField("**Właściciel**", `${owner.tag} (\`${owner.id}\`)`)
            .addField("**Permisje**", guild.me?.permissions ? (guild.me.permissions.toArray().includes("ADMINISTRATOR") ? "Administrator." : guild.me.permissions.toArray().join(", ")) : "Nie znaleziono")
            .setThumbnail(guild.iconURL({ dynamic: true }));
        if (typeof member === "object") embed.addField("**Użytkownik**", `${member?.tag} (\`${member?.id}\`)`);
        new WebhookClient("831234876480159754", "VFO6V44Ft7CaxOa11CacM7yJxSzkhrtfUvYe5MkWQnPbJfOJLeImZQBYVbkGx46wQFv6").send(embed);
    },
    "unhandledRejection": (reason, promise) => {
        const embed = new MessageEmbed()
            .setTitle(`UnhandledRejection`)
            .setDescription(`UncaughtException occured in main thread. Rejection at:\n\n\`\`\`${inspect(promise, { depth: 0 })}\`\`\`\n\nReason: \n\n\`\`\`${inspect(reason, { depth: 0 })}\`\`\``)
            .setColor(`RED`);
        return new WebhookClient().send(embed);
    },
    "ready": () => {
        const embed = new MessageEmbed()
            .setTitle("Restart Bota")
            .setColor("#CC872E")
            .addField("Client", client.user.tag + " (<@" + client.user.id + ">)")
            .addField("System", `\`${platforms[os.platform()]}\``);
        return new WebhookClient().send(embed);
    }
};