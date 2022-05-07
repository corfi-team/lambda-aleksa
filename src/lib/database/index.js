const r = require("rethinkdb");
const Logger = require("../modules/Logger");
const chalk = require("chalk");
const { indexes, tables } = require("../../../dbconfig.json");

const ServerManager = require("./managers/Servers.js");
const AutorespondersManager = require("./managers/Autoresponders");
const GbansManager = require("./managers/Gbans");
const PunishmentsManager = require("./managers/Punishments");
const MutesManager = require("./managers/Mutes");
const TempmutesManager = require("./managers/Tempmutes");
const TempbansManager = require("./managers/Tempbans");
const GiveawaysManager = require("./managers/Giveaways");
const BackupsManager = require("./managers/Backups");
const RemindManager = require("./managers/Reminders");
const UsersManager = require("./managers/Users");
const ReactionRoleManager = require("./managers/ReactionRole");
const LevelingManager = require("./managers/Levels");
const StarboardManager = require("./managers/Starboard");
const CooldownsManager = require("./managers/Cooldowns");

class Database {

    constructor() {
    }

    async connect(opts = {
        db: "Delover"
    }) {
        this.mainDB = opts?.db;
        Logger.log(`Attempt to connect to database [${chalk.red(`db=${opts.db}`)}]`);


        this.conn = await r.connect(opts).catch(() => {
            Logger.error("Unable to connect to the database");
            process.exit(1);
        });
        Logger.log(`Database connected`);


        this.servers = new ServerManager(this.conn);
        this.autoresponders = new AutorespondersManager(this.conn);
        this.gbans = new GbansManager(this.conn);
        this.punishments = new PunishmentsManager(this.conn);
        this.mutes = new MutesManager(this.conn);
        this.tempmutes = new TempmutesManager(this.conn);
        this.tempbans = new TempbansManager(this.conn);
        this.giveaways = new GiveawaysManager(this.conn);
        this.backups = new BackupsManager(this.conn);
        this.reminders = new RemindManager(this.conn);
        this.users = new UsersManager(this.conn);
        this.reactionrole = new ReactionRoleManager(this.conn);
        this.leveling = new LevelingManager(this.conn);
        this.starboard = new StarboardManager(this.conn);
        this.cooldowns = new CooldownsManager(this.conn);
    }

    async createTables() {
        if (!this.conn) throw new TypeError("Database is not connected");

        for (const tb of tables) {
            await r.db(this.mainDB).tableCreate(tb).run(this.conn).catch(() => {
                return false;
            });
            for (const j of indexes[tb]) {
                eval(`
                    const r = require("rethinkdb");
                    const conn = this.conn;

                    async function cr() {
                        ${j}
                    }

                    cr();
                `);
            }
        }
    }
}

delete require.cache[require.resolve("../../../dbconfig.json")];
delete require.cache[require.resolve("../modules/Logger")];

module.exports = Database;