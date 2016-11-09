var hue = require( "node-hue-api" ),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;
var app.config = require( './app.config' );

var HueInterface = function( app, cb ) {
    this.app = app;
    this.startConnection( cb );
};

HueInterface.prototype.startConnection = function( cb ) {
    console.log( this.app.config );
    var self = this;
    this.api = NodeHueApi( this.app.config.hue.host, this.app.config.hue.user );
    this.state = lightState.create();
    this.api.lights( function( err, lights ) {
        if ( err ) console.log( err );
        self.api.groups( function( err, rooms ) {
            var rooms = [];
            lights.lights.forEach( function( element ) {
                var find = false;
                for ( var i in rooms ) {
                    if ( rooms[ i ].includes( element.id ) ) {
                        room[ i ].addLight( new Light( element, room[ i ] ) );
                        find = true;
                        break;
                    }
                }
                if ( !find ) {
                    self.rooms[ i ] = new Room( rooms[ i ], self.app );
                    room[ i ].addLight( new Light( element, room[ i ] ) );
                }
            } );
            cb( rooms );
        } );
    } );
};

HueInterface.prototype.getLightsByRoom = function( room, cb ) {
    this.api.lights( function( err, lights ) {
        if ( err ) {
            console.log( err );
        }
        var ids = [];
        lights.lights.forEach( function( element ) {
            ids.push( element.id );
        } );
        cb( ids );
    } );
}

HueInterface.prototype.setIntensityByLight = function() {
    var self = this
}

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

module.exports = HueInterface;