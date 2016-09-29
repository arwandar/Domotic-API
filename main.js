var Config = require('./module/Utils/Config');
var Database = require('./module/Utils/Database');

//Init Config
var config = Config.get('../../config.yml');

//Init DB
var db = new Database(config);