var hue = require( "node-hue-api" ),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;
var Room = require('../Model/Room');
var Light = require('../Model/Light');

var HueInterface = function( app, cb ) {
    this.app = app;
    this.startConnection( cb );
};

HueInterface.prototype.startConnection = function( cb ) {
    console.log( this.app.config );
    var self = this;
    this.api = NodeHueApi( this.app.config.hue.host, this.app.config.hue.user );
    this.api.lights( function( err, lights ) {
        if ( err ) console.log( err );

        self.api.groups(function (err, result) {
            var rooms = [];
            result.forEach(function (element) {
                if (element.id != 0) rooms[element.name] = new Room(element, self.app);
            });

            lights.lights.forEach( function( element ) {
                for ( var i in rooms ) {
                    if (rooms[i].entity.lights.indexOf(element.id) >= 0) {
                        rooms[i].addLight(new Light(element, rooms[i]));
                    }
                }
            } );
            cb( rooms );
        } );
    } );
};

HueInterface.prototype.turnOnRoom = function (roomId) {
    var state = lightState.create();
    this.api.setGroupLightState(roomId, state.on());
};

HueInterface.prototype.turnOffRoom = function (roomId) {
    var state = lightState.create();
    this.api.setGroupLightState(roomId, state.off());
};

HueInterface.prototype.getLightsOn = function() {
    var self = this;
    this.api.lights( function( err, lights ) {
        if ( err ) {
            console.log( err );
        }
        self.state.turnOn();
        lights.lights.forEach( function( element ) {
            self.lightState( element.id );
        } );
    } );
};

HueInterface.prototype.getLightsOff = function() {
    var self = this;
    this.api.lights( function( err, lights ) {
        if ( err ) {
            console.log( err );
        }
        self.state.turnOff();
        lights.lights.forEach( function( element ) {
            self.lightState( element.id );
        } );
    } );
};

HueInterface.prototype.lightState = function( id ) {
    console.log( id );
    this.api.setLightState( id, this.state, function( err, result ) {
        if ( err ) {
            console.log( err );
        }
        console.log( result );
    } );
};


HueInterface.prototype.checkState = function(idLight, cb) {
    this.api.lightStatus(idLight, function(err, result) {
            if ( err ) {
            console.log( err );
        }
    cb(result);
});
};

module.exports = HueInterface;