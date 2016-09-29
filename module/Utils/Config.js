var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');

var Config = {
    get: function (configPath) {
        var file = fs.readFileSync(path.join(__dirname, configPath));
        var params = yaml.load(file);
        return params;
    }
}

module.exports = Config;