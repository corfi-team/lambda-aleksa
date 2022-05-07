const { MessageEmbed, MessageAttachment } = require("discord.js");
const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const fetch = require("node-fetch");
const list = ["BD", "BE", "BF", "BG", "BA", "BB", "WF", "BL", "BM", "BN", "BO", "BH", "BI", "BJ", "BT", "JM", "BV", "BW", "WS", "BQ", "BR", "BS", "JE", "BY", "BZ", "RU", "RW", "RS", "TL", "RE", "TM", "TJ", "RO", "TK", "GW", "GU", "GT", "GS", "GR", "GQ", "GP", "JP", "GY", "GG", "GF", "GE", "GD", "GB", "GA", "SV", "GN", "GM", "GL", "GI", "GH", "OM", "TN", "JO", "HR", "HT", "HU", "HK", "HN", "HM", "VE", "PR", "PS", "PW", "PT", "SJ", "PY", "IQ", "PA", "PF", "PG", "PE", "PK", "PH", "PN", "PL", "PM", "ZM", "EH", "EE", "EG", "ZA", "EC", "IT", "VN", "SB", "ET", "SO", "ZW", "SA", "ES", "ER", "ME", "MD", "MG", "MF", "MA", "MC", "UZ", "MM", "ML", "MO", "MN", "MH", "MK", "MU", "MT", "MW", "MV", "MQ", "MP", "MS", "MR", "IM", "UG", "TZ", "MY", "MX", "IL", "FR", "IO", "SH", "FI", "FJ", "FK", "FM", "FO", "NI", "NL", "NO", "NA", "VU", "NC", "NE", "NF", "NG", "NZ", "NP", "NR", "NU", "CK", "XK", "CI", "CH", "CO", "CN", "CM", "CL", "CC", "CA", "CG", "CF", "CD", "CZ", "CY", "CX", "CR", "CW", "CV", "CU", "SZ", "SY", "SX", "KG", "KE", "SS", "SR", "KI", "KH", "KN", "KM", "ST", "SK", "KR", "SI", "KP", "KW", "SN", "SM", "SL", "SC", "KZ", "KY", "SG", "SE", "SD", "DO", "DM", "DJ", "DK", "VG", "DE", "YE", "DZ", "US", "UY", "YT", "UM", "LB", "LC", "LA", "TV", "TW", "TT", "TR", "LK", "LI", "LV", "TO", "LT", "LU", "LR", "LS", "TH", "TF", "TG", "TD", "TC", "LY", "VA", "VC", "AE", "AD", "AG", "AF", "AI", "VI", "IS", "IR", "AM", "AL", "AO", "AQ", "AS", "AR", "AU", "AT", "AW", "IN", "AX", "AZ", "IE", "ID", "UA", "QA", "MZ"];

class Covid19Command extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "covid",
                aliases: ["covid19", "corona", "coronavirus", "covid-19"],
            },
            help: {
                description: "Pokazuje statystyki wirusa covid-19",
                usage: "<p>covid <akcja (all/list) lub kod kraju>",
                category: "Zabawa"
            }
        });

    }

    async run(message, { args, prefix }) {
        const sender = new Sender(message);
        if (args[0] === "all" || !args.length) {
            let all = await fetch("https://corona.lmao.ninja/v2/all").then(response => response.json());

            const embed = new MessageEmbed()
                .setColor(message.guild.settings?.colors?.done)
                .setTitle(`<:check_green:814098229712781313> Covid-19 - świat`)
                .setDescription(`Dane zostały zaktualizowane **${new Date(all.updated).toLocaleString()}**\nZainfekowane kraje: **${all.affectedCountries}**`)
                .addField(`Przypadki`, `Wszystkie: **${all.cases}**\nDzisiaj: **${all.todayCases}**\nWyzdrowiałych: **${all.recovered}**\nAktywne: **${all.active}**\nW stanie krytycznym: **${all.critical}**`)
                .addField(`Śmierci`, `Wszystkie: **${all.deaths}**\nDzisiaj: **${all.todayDeaths}**`)
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);

            message.reply(embed);
        } else if (list.includes(args[0].toUpperCase())) {
            const all = await fetch(`https://corona.lmao.ninja/v2/countries/${args[0].toUpperCase()}`).then(response => response.json());
            const attachment = new MessageAttachment(`https://www.countryflags.io/${args[0].toLowerCase()}/flat/64.png`, "icon.png");

            const name = await fetch(`https://restcountries.eu/rest/v2/alpha?codes=${args[0]}`).then(response => response.json());

            const embed = new MessageEmbed()
                .setColor(message.guild.settings?.colors?.done)
                .setTitle(`<:check_green:814098229712781313> Covid-19 - ${name[0].nativeName}`)
                .attachFiles(attachment)
                .setThumbnail(`attachment://icon.png`)
                .setDescription(`Dane zostały zaktualizowane **${new Date(all.updated).toLocaleString()}**`)
                .addField(`Przypadki`, `Wszystkie: **${all.cases}**\nDzisiaj: **${all.todayCases}**\nWyzdrowiałych: **${all.recovered}**\nAktywne: **${all.active}**\nW stanie krytycznym: **${all.critical}**`)
                .addField(`Śmierci`, `Wszystkie: **${all.deaths}**\nDzisiaj: **${all.todayDeaths}**`)
                .setFooter(client.footer, client.user.displayAvatarURL())
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL(ImageURLOptions)}`);


            message.reply(embed);
        } else if (args[0] === "list") {
            sender.create(`Lista kodów krajów: ${list.map(x => `\`${x}\``).join(", ")}`, "<:check_green:814098229712781313> Lista krajów");
        } else return sender.warn(`Niepoprawny argument \`<akcja lub kod kraju>\`\nNie podano poprawnej akcji lub kodu kraju\n\nPoprawne użycie: \`${prefix}covid <akcja (all/list) lub kod kraju>\``);

    }
}

module.exports = Covid19Command;
