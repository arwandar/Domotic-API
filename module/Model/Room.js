var Room = function (room) {
    this.entity = room;
    this.lights = [];
    this.ongoingEffect = false;
    this.willTurnOff = false;
};

Room.prototype.addLight = function (light) {
    this.lights.push(light);
};

Room.prototype.turnOn = function () {
    HueSingleton.getInstance().turnOnRoom(this.entity.id);
};

Room.prototype.turnOff = function () {
    this.ongoingEffect = false;
    HueSingleton.getInstance().turnOffRoom(this.entity.id);
};

Room.prototype.checkState = function (cb) {
    for (var i in this.lights) {
        HueSingleton.checkState(this.lights[i].entity.id, function (result) {
            cb(result.state.on);
        })
    }
};

// time in seconds
Room.prototype.extinctionAuto = function (time) {
    var self = this;
    this.checkState(function (state) {
        if (state && !self.willTurnOff) {
            self.willTurnOff = true;
            setTimeout(function () {
                self.turnOff();
                self.willTurnOff = false;
            }, time * 1000);
        }
    })
};

module.exports = Room;