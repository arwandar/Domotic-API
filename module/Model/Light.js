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

Light.prototype.fire = function() {
    var self = this;

    function restartFire() {
        console.log("miaw");
        if (self.room.ongoingEffect) {
            var random = Math.round(Math.random() * 500 + 500);
            console.log('random', random);
            setTimeout(function() {
                hueSingleton.randomWhite(self.entity.id);
                restartFire();
            }, random);
        }
    }

    restartFire();
};

module.exports = Light;
