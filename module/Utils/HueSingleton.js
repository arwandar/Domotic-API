var hue = require("node-hue-api"),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;
var config = require('./ConfigSingleton');
var Room = require('../Model/Room');
var Light = require('../Model/Light');

var HueSingleton = function HueSingleton() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var api;
    var rooms = [];
    var lights = [];

    this.init = function() {
        api = NodeHueApi(config.hue.host, config.hue.user);

        api.groups().then(function(roomsResult) {
                roomsResult.forEach(function(room) {
                    if (room.id != 0) rooms[room.name] = new Room(room);
                });
                return api.lights();
            }).then(function(lightsResult) {
                lightsResult.lights.forEach(function(light) {
                    for (var i in rooms) {
                        if (rooms[i].entity.lights.indexOf(light.id) >= 0) {
                            lights[light.name] = new Light(light, rooms[i]);
                            rooms[i].addLight(lights[light.name]);
                        }
                    }
                });
                console.log("init bridge done");
            })
            .catch(function(error) {
                console.log("error!!!", error);
            }).done();
    };

    this.getRooms = function() {
        return rooms;
    }

    this.getRoom = function(name) {
        if (rooms[name] != undefined) {
            return rooms[name];
        } else {
            return false;
        }
    };

    this.getLight = function(name) {
        if (lights[name] != undefined) {
            return lights[name];
        } else {
            return false;
        }
    }

    this.turnOnRoom = function(roomId) {
        var state = lightState.create();
        api.setGroupLightState(roomId, state.on());
    };

    this.turnOffRoom = function(roomId) {
        var state = lightState.create();
        api.setGroupLightState(roomId, state.off());
    };

    this.turnOnLight = function(lightId) {
        var state = lightState.create();
        api.setLightState(lightId, state.on());
    };

    this.turnOffLight = function(lightId) {
        var state = lightState.create();
        api.setLightState(lightId, state.off());
    };

    this.checkState = function(idLight, cb) {
        api.lightStatus(idLight, function(err, result) {
            if (err) {
                console.log(err);
            }
            cb(result);
        });
    };

    this.randomWhite = function(lightId) {
        var intensite = Math.round(Math.random() * 100 + 1);
        console.log(intensite);
        var state = lightState.create().on().white(500, intensite);
        api.setLightState(lightId, state);
    }

    //NOT USE
    this.lightState = function(id) {
        console.log(id);
        api.setLightState(id, this.state, function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
    };

    if (HueSingleton.caller != HueSingleton.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/* ************************************************************************
 HueSingleton CLASS DEFINITION
 ************************************************************************ */
HueSingleton.instance = null;

/**
 * HueSingleton getInstance definition
 * @return HueSingleton class
 */
HueSingleton.getInstance = function() {
    if (this.instance === null) {
        this.instance = new HueSingleton();
        this.instance.init();
    }
    return this.instance;
};

module.exports = HueSingleton.getInstance();
