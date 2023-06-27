const tool = require("rexar-tools").default;
const { stripIndent } = require("common-tags");
const colors = require('colors');
const thisVersion = require("./package.json").version;
tool.npm("inflames.db").then(m => {
    const latestVersion = m.version;
    if(thisVersion !== latestVersion) {
        console.log(stripIndent`inflames.db New Version Available!`.red.bold);
        console.log(stripIndent`${thisVersion} => ${latestVersion}`.blue.bold)
    }
});

/**
 * Allows you to use bson as database file.
 */
exports.bson = (file="inflames") => require("./src/drivers/bson")(file);

/**
 * Allows you to use sqlite as database file.
 */
exports.sqlite = (file="inflames") => require("./src/drivers/sqlite")(file);
