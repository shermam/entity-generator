const util = require('util');
const sql = require("msnodesqlv8");
const query = util.promisify(sql.query);

module.exports = class Database {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    query(command) {
        return query(this.connectionString, command);
    }
}