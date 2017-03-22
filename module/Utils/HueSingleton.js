var hue = require("node-hue-api"),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;
var config = require('./ConfigSingleton');
var Room = require('../Model/Room')
var Light = require('../Model/Light')

var HueSingleton = function HueSingleton() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var api;
    var rooms = [];
    var lights = [];

    this.init = function () {
        console.log("miaw", config.hue);
        api = NodeHueApi(config.hue.host, config.hue.user);

        api.lights(function (lightErr, lightsResult) {
            api.groups(function (roomErr, roomsResult) {
                if (lightErr || roomErr) {
                    console.log(lightErr + roomErr);
                    return;
                }

                roomsResult.forEach(function (room) {
                    if (room.id != 0) rooms[room.name] = new Room(room);

                });

                lightsResult.lights.forEach(function (light) {
                    for (var i in rooms) {
                        if (rooms[i].entity.lights.indexOf(light.id) >= 0) {
                            lights[light.name] = new Light(light, rooms[i]);
                            rooms[i].addLight(lights[light.name]);
                        }
                    }
                });
            });
        });

        console.log(rooms);
    };

    this.getRoom = function (name) {
        if (rooms[name] != undefined) {
            return rooms[name];
        } else {
            return false;
        }
    };

    this.getLight = function (name){
        if (lights[name] != undefined) {
            return lights[name];
        } else {
            return false;
        }
    }

    this.getRooms = function (){
        return rooms;
    }

    this.turnOnRoom = function (roomId) {
        var state = lightState.create();
        api.setGroupLightState(roomId, state.on());
    };

    this.turnOffRoom = function (roomId) {
        var state = lightState.create();
        api.setGroupLightState(roomId, state.off());
    };

    this.turnOnLight = function (lightId) {
        var state = lightState.create();
        api.lightState(roomId, state.on());
    };

    this.turnOffLight = function (lightId) {
        var state = lightState.create();
        api.lightState(roomId, state.on());
    };

    this.checkState = function (idLight, cb) {
        api.lightStatus(idLight, function (err, result) {
            if (err) {
                console.log(err);
            }
            cb(result);
        });
    };

    this.lightState = function (id) {
        console.log(id);
        api.setLightState(id, this.state, function (err, result) {
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
HueSingleton.getInstance = function () {
    if (this.instance === null) {
        this.instance = new HueSingleton();
        this.instance.init();
    }
    return this.instance;
};

module.exports = HueSingleton.getInstance();