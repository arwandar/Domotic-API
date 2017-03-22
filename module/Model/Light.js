var HueSingleton = require('../Utils/HueSingleton');


var Light = function (light, room) {
    this.entity = light;
    this.room = room;
};

Light.prototype.turnOn = function () {
    HueSingleton.turnOnLight(this.entity.id);
};

Light.prototype.turnOff = function () {
    HueSingleton.turnOffLight(this.entity.id);
};

module.exports = Light;