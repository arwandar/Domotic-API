var hueSingleton;

var Room = function(room) {
    hueSingleton = require('../Utils/HueSingleton');
    this.entity = room;
    this.lights = [];
    this.ongoingEffect = false;
    this.willTurnOff = false;
};

Room.prototype.addLight = function(light) {
    this.lights.push(light);
};

Room.prototype.turnOn = function() {
    hueSingleton.turnOnRoom(this.entity.id);
};

Room.prototype.turnOff = function() {
    this.ongoingEffect = false;
    hueSingleton.turnOffRoom(this.entity.id);
};

Room.prototype.checkState = function(cb) {
    for (var i in this.lights) {
        hueSingleton.checkState(this.lights[i].entity.id, function(result) {
            cb(result.state.on);
        })
    }
};

// time in seconds
Room.prototype.extinctionAuto = function(time) {
    var self = this;
    this.checkState(function(state) {
        if (state && !self.willTurnOff) {
            self.willTurnOff = true;
            setTimeout(function() {
                self.turnOff();
                self.willTurnOff = false;
            }, time * 1000);
        }
    })
};

module.exports = Room;
