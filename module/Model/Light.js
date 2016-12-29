var Light = function (light, room) {
    this.entity = light;
    this.room = room;
};

Room.prototype.turnOn = function () {
    HueSingleton.getInstance().turnOnLight(this.entity.id);
};

Room.prototype.turnOff = function () {
    HueSingleton.getInstance().turnOffLight(this.entity.id);
};

module.exports = Light;