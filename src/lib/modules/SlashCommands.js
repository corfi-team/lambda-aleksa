const { MessageEmbed } = require("discord.js");
const perms = {
    1: "1: Użytkownik",
    2: "2: Pomocnik",
    3: "3: Moderator",
    4: "4: Administator",
    5: "5: Właściciel serwera",
    6: "6: Programista"
};

module.exports.init = () => {
    client.api.applications(client.config.dashboard.clientID).commands.post({
        data: {
            name: "ping",
            description: "Sprawdza ping bota"
        }
    });

    client.api.applications(client.config.dashboard.clientID).commands.post({
        data: {
            name: "help",
            description: "Pokazuje informacje dot. komendy",
            options: [
                {
                    type: 3,
                    name: "command",
                    required: false,
                    description: "Pokazuje informacje dot. komendy"
                }
            ]
        }
    });

    client.api.applications(client.config.dashboard.clientID).commands.post({
        data: {
            name: "links",
            description: "Pokazuje linki związane z botem",
        }
    });

    client.ws.on("INTERACTION_CREATE", async interaction => {
        switch (interaction.data.name.toLowerCase()) {
            case "ping": {
                const settings = await client.db.servers.get(interaction.guild_id);
                const author = await client.users.fetch(interaction.member.user.id);
                const embed = new MessageEmbed()
                    .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions))
                    .setColor(settings?.colors?.done)
                    .setTitle(`<:check_green:814098229712781313> Ping`)
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setDescription(`**\`\`\`${client.ws.shards.map((s) => `SHARD [${s.id}]: ${s.ping}ms`)}\`\`\`**`);
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: "",
                            embeds: [embed]
                        }
                    }
                });
                break;
            }
            case "help": {
                const settings = await client.db.servers.get(interaction.guild_id);
                const author = await client.users.fetch(interaction.member.user.id);
                if (interaction.data.options?.length) {
                    const arg = interaction.data.options[0]?.value;
                    const command = client.commands.get(arg) || client.commands.find(x => x.conf.aliases && x.conf.aliases.includes(arg));
                    if (!command) {
                        const embed = new MessageEmbed()
                            .setTitle("<:warn2:788533529285492736> Ostrzeżenie")
                            .setDescription("Nie znaleziono takiej komendy")
                            .setFooter(client.footer)
                            .setColor(settings.colors.warn)
                            .setFooter(client.footer, client.user.displayAvatarURL())
                            .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions));
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: "",
                                    embeds: [embed]
                                }
                            }
                        });
                        return;
                    }

                    if (command.help.category === "Prywatne") {
                        const embed = new MessageEmbed()
                            .setTitle("<:warn2:788533529285492736> Ostrzeżenie")
                            .setDescription("Ta komenda jest prywatna")
                            .setFooter(client.footer)
                            .setColor(settings.colors.warn)
                            .setFooter(client.footer, client.user.displayAvatarURL())
                            .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions));
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: "",
                                    embeds: [embed]
                                }
                            }
                        });
                        return;
                    }
                    const embed = new MessageEmbed()
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions))
                        .setColor(settings?.colors?.done)
                        .setTitle("<:check_green:814098229712781313> Pomoc dotycząca komendy")
                        .addField("Nazwa", `\`${command.conf.name}\``)
                        .addField("Aliases", `${command.conf.aliases.length ? `\`${command.conf.aliases.join(", ")}\`` : "Brak"}`)
                        .addField("Opis", `\`${command.help.description}\``)
                        .addField("Wyłączona", `\`${command.conf.disabled ? "Tak" : "Nie"}\``)
                        .addField("Wymagane uprawnienia:", `\`${perms[command.conf.permissionLevel || 1]}\``)
                        .addField("Wymagane uprawnienia bota:", `\`${command.conf.botPerm || "SEND_MESSAGES"}\``)
                        .addField("Kategoria", `\`${command.help.category}\``)
                        .addField("Użycie:", `\`${command.help.usage.replace(/<p>/g, settings.prefixes[0])}\``)
                        .addField("Flagi", `${command.help.flags || "Brak"}`);
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: "",
                                embeds: [embed]
                            }
                        }
                    });

                } else {
                    const devCommands = client.commands.filter(x => x.help.category === "Deweloperskie" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const adminCommands = client.commands.filter(x => x.help.category === "Administracyjne" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const configCommands = client.commands.filter(x => x.help.category === "Konfiguracyjne" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const funCommands = client.commands.filter(x => x.help.category === "Zabawa" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const toolsCommands = client.commands.filter(x => x.help.category === "Narzędzia" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const giveawayCommands = client.commands.filter(x => x.help.category === "Giveaways" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const botsCommands = client.commands.filter(x => x.help.category === "Bot" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const levelsCommands = client.commands.filter(x => x.help.category === "Poziomy" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const animeCommands = client.commands.filter(x => x.help.category === "Anime" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];
                    const imgCommands = client.commands.filter(x => x.help.category === "Obrazki" && !x.conf.disabled).map(x => `\`${x.conf.name}\``) || [];

                    const embed = new MessageEmbed()
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions))
                        .setColor(settings?.colors?.done)
                        .setTitle("<:check_green:814098229712781313> Pomoc")
                        .addField(`<:icon_bot:705077043594920026> Komendy podstawowe (\`${botsCommands.length}\`)`, botsCommands.join(", ") || "Brak")
                        .addField(`<:badge_developer:705076933645434891> Komendy deweloperskie (\`${devCommands.length}\`)`, devCommands.join(", ") || "Brak")
                        .addField(`<:icon_ban:724362485116960779> Komendy administracyjne (\`${adminCommands.length}\`)`, adminCommands.join(", ") || "Brak")
                        .addField(`<:icon_settings:705076529561862174> Komendy konfiguracyjne (\`${configCommands.length}\`)`, configCommands.join(", ") || "Brak")
                        .addField(`<a:icon_emoji:724362696069349406> Fun (\`${funCommands.length}\`)`, funCommands.join(", ") || "Brak")
                        .addField(`<:icon_mention:705076605172842496> Obrazkowe (\`${imgCommands.length}\`)`, imgCommands.join(", ") || "Brak")
                        .addField(`🇯🇵 Anime (\`${animeCommands.length}\`)`, animeCommands.join(", ") || "Brak")
                        .addField(`<:icon_pin:705076546452324432> Narzędzia (\`${toolsCommands.length}\`)`, toolsCommands.join(", ") || "Brak")
                        .addField(`🎉 Giveaway (\`${giveawayCommands.length}\`)`, giveawayCommands.join(", ") || "Brak")
                        .addField(`<:icon_channel:705076734730567760> Poziomy (\`${levelsCommands.length}\`)`, levelsCommands.join(", ") || "Brak");
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: "",
                                embeds: [embed]
                            }
                        }
                    });
                }
                break;
            }
            case "links": {
                const settings = await client.db.servers.get(interaction.guild_id);
                const author = await client.users.fetch(interaction.member.user.id);
                const embed = new MessageEmbed()
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(author.tag, author.displayAvatarURL(ImageURLOptions))
                    .setColor(settings?.colors?.done)
                    .setDescription("[Serwer Support](https://discord.gg/nE9BtwXVUW) | [Strona](http://delover.xyz) | [Dodanie bota](https://discord.com/api/oauth2/authorize?client_id=814064909313638450&permissions=8&scope=bot%20applications.commands)")
                    .setTitle("<:check_green:814098229712781313> Linki");
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: "",
                            embeds: [embed]
                        }
                    }
                });
                break;
            }
        }
    });
};