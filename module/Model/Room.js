var Room = function( room, app ) {
    this.app = app;
    this.entity = room;
    this.lights = [];
    this.ongoingEffect = false;
}

Room.prototype.addLight = function( light ) {
    this.lights.push( light );
};

Room.prototype.turnOn = function() {
    //TODO
};

moddule.exports = Room;