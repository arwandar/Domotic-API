var Knex = require('knex');

var DatabaseSingleton = function DatabaseSingleton() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var db;

    this.connect = function (params) {
        db = new Knex({
            client: 'mysql',
            connection: params,
            debug: false,
        });
    };

    this.persist = function (obj, table, callback) {
        db.from(table).insert(obj).then(function (row) {
            if (callback != null) {
                callback(row);
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    if (DatabaseSingleton.caller != DatabaseSingleton.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/* ************************************************************************
 HueSingleton CLASS DEFINITION
 ************************************************************************ */
DatabaseSingleton.instance = null;

/**
 * HueSingleton getInstance definition
 * @return HueSingleton class
 */
DatabaseSingleton.getInstance = function () {
    if (this.instance === null) {
        this.instance = new DatabaseSingleton();
        var config = ConfigSingleton.getInstance();
        params = {
            "host": config.database.host,
            "database": config.database.name,
            "user": config.database.user,
            "password": config.database.pass,
            "charset": "utf8mb4_unicode_ci",
        };
        this.instance.connect(params);
    }
    return this.instance;
};

module.exports = DatabaseSingleton.getInstance();
