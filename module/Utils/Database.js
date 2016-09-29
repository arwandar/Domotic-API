var Knex = require('knex');

var Database = function (config) {
    this.prepare(config);
    this.connect();
};

Database.prototype.prepare = function (config) {
    this.params = {
        "host": config.database.host,
        "database": config.database.name,
        "user": config.database.user,
        "password": config.database.pass,
        "charset": "utf8mb4_unicode_ci",
    };
}

Database.prototype.connect = function () {
    this.db = new Knex({
        client: 'mysql',
        connection: this.params,
        debug: false,
    });
}

//Gloabal
Database.prototype.persist = function (obj, table, callback) {
    this.db.from(table).insert(obj).then(function (row) {
        if (callback != null) {
            callback(row);
        }
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports = Database;