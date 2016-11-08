var hue = require("node-hue-api"),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;
var Config = require('./Config');

var HueInterface = function (config) {
    this.config = config;
    this.startConnection();
};

HueInterface.prototype.startConnection = function () {
    console.log(this.config);
    this.api = NodeHueApi(this.config.hue.host, this.config.hue.user);
    this.state = lightState.create();
    this.api.getDescription(function (err, config) {
        if (err) {
            console.log('erreur lors de la connexion au bridge');
            console.log(err);
            process.exit(-1);
        }
        console.log('connexion au bridge réussie')

    });
};

HueInterface.prototype.getLightsOn = function () {
    var self = this;
    this.api.lights(function (err, lights) {
        if (err) {
            console.log(err);
        }
        self.state.turnOn();
        lights.lights.forEach(function (element) {
            self.lightState(element.id);
        });
    });
};

HueInterface.prototype.getLightsOff = function () {
    var self = this;
    this.api.lights(function (err, lights) {
        if (err) {
            console.log(err);
        }
        self.state.turnOff();
        lights.lights.forEach(function (element) {
            self.lightState(element.id);
        });
    });
};

HueInterface.prototype.lightState = function (id) {
    console.log(id);
    this.api.setLightState(id, this.state, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });
};

module.exports = HueInterface;