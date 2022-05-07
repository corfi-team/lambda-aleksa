require("./Math");
require("./Message");
require("./Map");
require("./Global");
require("./Array");
require("./String");
require("./Date");

delete require.cache[require.resolve("./Math")];
delete require.cache[require.resolve("./Message")];
delete require.cache[require.resolve("./Map")];
delete require.cache[require.resolve("./Global")];
delete require.cache[require.resolve("./Array")];
delete require.cache[require.resolve("./String")];
delete require.cache[require.resolve("./Date")];