const BaseCommand = require("../../lib/base/BaseCommand");
const Sender = require("../../lib/modules/Sender");
const wiki = require("../../lib/apis/Wikipedia");

class WikiCommand extends BaseCommand {
    constructor() {
        super({
            conf: {
                name: "wiki",
                aliases: ["wikipedia"],
            },
            help: {
                description: "Wyszukuje cos w wikipedii",
                usage: "<p>wiki <wyszukiwanie>",
                category: "Zabawa",
                flags: "`-search` - Wyszukuje fraze"
            }
        });
    }

    async run(message, { args, prefix }) {

        const sender = new Sender(message);
        if (!args[0]) return sender.warn(`Niepoprawny argument \`<wyszukiwanie>\`\nNie podano frazy do wyszukania\n\nPoprawne użycie: \`${prefix}wiki <wyszukiwanie>\``);
        if (message.flags[0] === "search") {
            const searchResults = await wiki.search(args.join(" "));
            const results = searchResults.results.map(r => `\`${r.title}\``).join("\n");
            sender.create(`${results || "Nie znaleziono takiej frazy"}`, "<:check_green:814098229712781313> Wiki");
            return;
        }
        await wiki.setLang("pl");
        const page = await wiki.page(args.join(" ")).catch(async r => {
            const searchResults = await wiki.search(args.join(" "));
            const results = searchResults.results.map(r => `\`${r.title}\``).join("\n");
            sender.create(`${results || "Nie znaleziono takiej frazy"}`, "<:check_green:814098229712781313> Wiki");
        });
        if (!page) return;
        let content = await page.intro();
        if (content.length > 2047) content = "Podany tekst jest zbyt długi";
        sender.create(`${content || "Brak"}\n\n[link](${page.fullurl})`, "<:check_green:814098229712781313> Wiki");
    }
}

module.exports = WikiCommand;

