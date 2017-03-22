var hue = require( "node-hue-api" ),
    NodeHueApi = hue.HueApi,
    lightState = hue.lightState;

var HueSingleton = function HueSingleton() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var socketList = {};
    var api;

    this.init = function( config, cb ) {
        api = NodeHueApi( config.hue.host, config.hue.user );

        api.lights( function( lightErr, lightsResult ) {
            api.groups( function( roomErr, roomsResult ) {
                if ( lightErr || roomErr ) {
                    console.log( lightErr + roomErr );
                    cb( false );
                    return;
                }

                var rooms = [];
                roomsResult.forEach( function( room ) {
                    if ( room.id != 0 ) rooms[ room.name ] = new Room( room );
                } );

                lights.lights.forEach( function( light ) {
                    for ( var i in rooms ) {
                        if ( rooms[ i ].entity.lights.indexOf( light.id ) >= 0 ) {
                            rooms[ i ].addLight( new Light( light, rooms[ i ] ) );
                        }
                    }
                } );

                cb( rooms );
            } );
        } );

    }

    this.turnOnRoom = function( roomId ) {
        var state = lightState.create();
        api.setGroupLightState( roomId, state.on() );
    };

    this.turnOffRoom = function( roomId ) {
        var state = lightState.create();
        api.setGroupLightState( roomId, state.off() );
    };

    this.turnOnLight = function( lightId ) {
        var state = lightState.create();
        api.lightState( roomId, state.on() );
    };

    this.turnOffLight = function( lightId ) {
        var state = lightState.create();
        api.lightState( roomId, state.on() );
    };

    if ( HueSingleton.caller != HueSingleton.getInstance ) {
        throw new Error( "This object cannot be instanciated" );
    }
}

/* ************************************************************************
HueSingleton CLASS DEFINITION
************************************************************************ */
HueSingleton.instance = null;

/**
 * HueSingleton getInstance definition
 * @return HueSingleton class
 */
HueSingleton.getInstance = function() {
    if ( this.instance === null ) {
        this.instance = new HueSingleton();
    }
    return this.instance;
}

module.exports = HueSingleton.getInstance();