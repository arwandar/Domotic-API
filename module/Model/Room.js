var Room = function( room, app ) {
    this.app = app;
    this.entity = room;
    this.lights = [];
    this.ongoingEffect = false;
};

Room.prototype.addLight = function( light ) {
    this.lights.push( light );
};

Room.prototype.turnOn = function() {
    this.app.hue.turnOnRoom(this.entity.id);
};

Room.prototype.turnOff = function () {
    this.app.hue.turnOffRoom(this.entity.id);
};

Room.prototype.checkState = function(cb) {
	for(var i in lights){
		this.app.hue.checkState(lights[i].entity.id, function(result){
			console.log(result);
		})
	}
};

module.exports = Room;