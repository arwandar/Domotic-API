var hueSingleton;

var Light = function(light, room) {
    hueSingleton = require('../Utils/HueSingleton');
    this.entity = light;
    this.room = room;
};

Light.prototype.turnOn = function() {
    hueSingleton.turnOnLight(this.entity.id);
};

Light.prototype.turnOff = function() {
    hueSingleton.turnOffLight(this.entity.id);
};

module.exports = Light;
