var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');

var ConfigSingleton = function ConfigSingleton() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var params;

    this.init = function () {
        var file = fs.readFileSync(path.join(__dirname, '../../config.json'));
        params = yaml.load(file);
    }

    this.getParams = function(){
        return params;
    }

    if (ConfigSingleton.caller != ConfigSingleton.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/* ************************************************************************
 HueSingleton CLASS DEFINITION
 ************************************************************************ */
ConfigSingleton.instance = null;

/**
 * ConfigSingleton getInstance definition
 * @return ConfigSingleton class
 */
ConfigSingleton.getInstance = function () {
    if (this.instance === null) {
        this.instance = new ConfigSingleton();
        this.instance.init()
    }
    return this.instance;
};

module.exports = ConfigSingleton.getInstance();
