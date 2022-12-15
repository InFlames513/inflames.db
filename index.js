/**
 * Allows you to use bson as database file.
 */
exports.bson = () => require("./src/drivers/bson");

/**
 * Allows you to use sqlite as database file.
 */
exports.sqlite = () => require("./src/drivers/sqlite");