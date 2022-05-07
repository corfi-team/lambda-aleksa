const BaseCommand = require("../../lib/base/BaseCommand");
const canvas = require("canvas");
const Discord = require("discord.js");
const Sender = require("../../lib/modules/Sender");

class DeathBCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "deathbattle",
                aliases: ["uderz", "pobij", "pierdolnij"],
                permissionLevel: 1
            },
            help: {
                description: "Rozpoczyna walkę między użytkownikami.",
                usage: "<p>deathbattle",
                category: "Zabawa",
            }
        });
    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        message.channel.startTyping();

        const user1 = await client.functions.getUser(message, args[0]) || await client.functions.fetchUser(message, args[0]);
        const user2 = await client.functions.getUser(message, args[1]) || await client.functions.fetchUser(message, args[1]) || message.author;

        if (!user1) {
            message.channel.stopTyping(1);
            return sender.warn(`Niepoprawny argument \`<użytkownik 1>\`\nNie podano użytkownika\n\nPoprawne użycie: \`${prefix}deathbattle <użytkownik 1> <użytkownik 2>\``);
        }
        if (!user2) {
            message.channel.stopTyping(1);
            return sender.warn(`Niepoprawny argument \`<użytkownik 2>\`\nNie podano użytkownika\n\nPoprawne użycie: \`${prefix}deathbattle <użytkownik 1> <użytkownik 2>\``);
        }
        if (user1.id === user2.id && user2.id === message.author.id || user1.id === user2.id && user2.id !== message.author.id) {
            message.channel.stopTyping(1);
            return sender.warn(`Niepoprawny argument \`<użytkownik 1>\` lub \`<użytkownik 2>\`\nNie można toczyć walki z tymi samymi użytkownik\n\nPoprawne użycie: \`${prefix}deathbattle <użytkownik 1> <użytkownik 2>\``);
        }

        user1.hp = 150;
        user2.hp = 150;
        let image = canvas.createCanvas(889, 677);
        const sticker = await canvas.loadImage("./src/lib/canvas/images/deathbattle.png");
        const avatar1 = await canvas.loadImage(user1.displayAvatarURL({ format: "png", size: 512 }));
        const avatar2 = await canvas.loadImage(user2.displayAvatarURL({ format: "png", size: 512 }));
        const img = image.getContext("2d");
        img.drawImage(sticker, 0, 0, sticker.width, sticker.height);
        img.drawImage(avatar1, 66, 225, 348, 405);
        img.drawImage(avatar2, 472, 225, 348, 405);
        img.strokeStyle = "#ff0000";
        img.strokeRect(0, 0, image.width, image.height);
        img.beginPath();
        img.arc(125, 125, 100, 0, Math.PI * 2, true);
        img.closePath();
        img.clip();
        image = image.toBuffer();
        const attachment = new Discord.MessageAttachment(image, "deathbattle.png");
        await message.channel.stopTyping(1);
        const embed = new Discord.MessageEmbed()
            .setTitle("Deathbattle!")
            .attachFiles(attachment)
            .setImage("attachment://deathbattle.png")
            .setDescription("**" + user1.tag + "** - __" + user1.hp.toString() + "HP__ :heart:\n**" + user2.tag + "** - __" + user2.hp.toString() + "HP__ :heart:")
            .setFooter(client.footer, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
            .setColor(message.guild.settings?.colors?.done);
        setTimeout(() => {
            message.reply(embed).then((sent) => {
                setTimeout(() => {
                    fight(message, user1, user2, sent);
                }, 1800);
            });
        }, 1200);


        const fight = (message, user1, user2, sent) => {
            const weapons = [
                "uderza {u} gaśnicą.",
                "uderza {u} krzesłem.",
                "uderza {u} zeschniętą bagietką.",
                "kopie {u} z półobrotu.",
                "strzela do {u} z łuku Nokią 3310.",
                "wsadza granat za pasek {u}.",
                "rzuca do {u} wiatrówką, bo nie ma amunicji.",
                "uderza {u} gołą pięścią.",
                "zaprasza {u} do gry w precle i w odpowiednim momencie uderza przeciwnika prosto w kręgosłup.",
                "wysyła podrobione zdjęcia {u} z protestu antyislamskiego na Iracką grupę facebook i nie kończy się to dobrze...",
            ];
            const maxDamage = [9, 15, 25, 20, 50, 50, 30, 20, 55, 35];
            const minDamage = [5, 10, 16, 16, 30, 0, 15, 0, 25, 15];
            const number1 = Math.floor(Math.random() * weapons.length);
            const number2 = Math.floor(Math.random() * weapons.length);
            const damage1 = Math.floor(Math.random() * (maxDamage[number1] - minDamage[number1])) + minDamage[number1];
            const damage2 = Math.floor(Math.random() * (maxDamage[number2] - minDamage[number2])) + minDamage[number2];
            const embeds = [
                new Discord.MessageEmbed()
                    .setTitle("Deathbattle!")
                    .attachFiles(attachment)
                    .setImage("attachment://deathbattle.png")
                    .setDescription("**" + user1.tag + "** - __" + user1.hp.toString() + "HP__ :heart:\n**" + user2.tag + "** - __" + (user2.hp - damage1).toString() + "HP__ :broken_heart:\n\n**" + user1.tag + "** " + weapons[number1].replace(/{u}/g, "**" + user2.tag + "**") + " - __" + damage1.toString() + "HP__.")
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setColor(message.guild.settings?.colors?.done),
                new Discord.MessageEmbed()
                    .setTitle("Deathbattle!")
                    .attachFiles(attachment)
                    .setImage("attachment://deathbattle.png")
                    .setDescription("**" + user1.tag + "** - __" + (user1.hp - damage2).toString() + "HP__ :broken_heart:\n**" + user2.tag + "** - __" + user2.hp.toString() + "HP__ :heart:\n\n**" + user2.tag + "** " + weapons[number2].replace(/{u}/g, "**" + user1.tag + "**") + " - __" + damage2.toString() + "HP__.")
                    .setFooter(client.footer, client.user.displayAvatarURL())
                    .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                    .setColor(message.guild.settings?.colors?.done)
            ];


            setTimeout(() => {
                user2.hp = user2.hp - damage1;
                sent.edit(embeds[0]);
                let endingHit = [weapons[number1], damage1];
                if (user2.hp > 0) {
                    setTimeout(() => {
                        user1.hp = user1.hp - damage2;
                        sent.edit(embeds[1]);
                        endingHit = [weapons[number2], damage2];
                        winOrStillFight(message, user1, user2, sent, endingHit);
                    }, 4000);
                } else {
                    setTimeout(() => {
                        winOrStillFight(message, user1, user2, sent, endingHit);
                    }, 4000);
                }
            }, 4000);
        };

        function winOrStillFight(message, user1, user2, sent, endingHit) {
            if (user1.hp > 0 && user2.hp > 0) {
                setTimeout(() => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Deathbattle!")
                        .attachFiles(attachment)
                        .setImage("attachment://deathbattle.png")
                        .setDescription("**" + user1.tag + "** __" + user1.hp.toString() + "HP__ :heart:\n**" + user2.tag + "** __" + user2.hp.toString() + "HP__ :heart:")
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                        .setColor(message.guild.settings?.colors?.done);
                    sent.edit(embed);
                    fight(message, user1, user2, sent);
                }, 4000);
            } else {
                if (user1.hp < 0) user1.hp = 0;
                if (user2.hp < 0) user2.hp = 0;
                const embeds = [
                    new Discord.MessageEmbed()
                        .setTitle("Death!")
                        .attachFiles(attachment)
                        .setImage("attachment://deathbattle.png")
                        .setDescription("**" + user1.tag + "** __" + user1.hp.toString() + "HP__ :crown:\n**" + user2.tag + "** __" + (user2.hp).toString() + "HP__ :skull_crossbones:\n\n:confetti_ball: **" + user1.tag + " __wygrywa__!!!** :tada:\n\n**Cios kończący:**\n**Zwycięzca** __" + endingHit[0].replace(/{u}/g, "**przegranego**") + "__ - **" + endingHit[1] + "HP.**")
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                        .setColor(message.guild.settings?.colors?.done),
                    new Discord.MessageEmbed()
                        .setTitle("Death!")
                        .attachFiles(attachment)
                        .setImage("attachment://deathbattle.png")
                        .setDescription("**" + user1.tag + "** __" + user1.hp.toString() + "HP__ :skull_crossbones:\n**" + user2.tag + "** __" + (user2.hp).toString() + "HP__ :crown:\n\n:confetti_ball: **" + user2.tag + " __wygrywa__!!!** :tada:\n\n**Cios kończący:**\n**Zwycięzca** __" + endingHit[0].replace(/{u}/g, "**przegranego**") + "__ - **" + endingHit[1] + "HP.**")
                        .setFooter(client.footer, client.user.displayAvatarURL())
                        .setAuthor(message.author.tag, message.author.displayAvatarURL(ImageURLOptions))
                        .setColor(message.guild.settings?.colors?.done)

                ];
                setTimeout(() => {
                    if (user1.hp > 0) {
                        sent.edit(embeds[0]);
                    } else if (user2.hp > 0) {
                        sent.edit(embeds[1]);
                    }
                }, 4000);
            }
        }
    }
}

module.exports = DeathBCommand;