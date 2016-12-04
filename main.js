var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {
    extended: false
} );
var schedule = require('node-schedule');

var Config = require( './module/Utils/Config' );
var Database = require( './module/Utils/Database' );
var HueInterface = require( './module/Utils/HueInterface' );

//Init
var config = Config.get( '../../config.json' );
// var db = new Database( config );

var app = {
    config: config,
    // db: db,
};

app.hue = new HueInterface( app, function( result ) {
    app.rooms = result;
    console.log(app.rooms);
    console.log('done');
} );

var application = express();

application.get( '/informations', function( req, res ) {
    app.hue.api.getDescription( function( err, conf ) {
        if ( err ) {
            console.log( err );
            return;
        }
        console.log( conf );
        res.status( 200 ).send( conf );
    } );
} );

application.get('/informationsBis', function (req, res) {
    var result = [];
    // console.log(app.rooms);
    app.rooms.forEach(function (room) {
        console.log(room);
        var element = {
            name: room.entity.name,
            lights: []
        };
        console.log(element);
        room.lights.forEach(function (light) {
            element.lights.push(light.entity.id);
        });
        console.log(element);
        result.push(element);
    });

    res.status(200).send(result);
});

application.get('/turn_on', function (req, res) {
    if ( app.rooms[ req.query[ 'room' ] ] != undefined ) {
        app.rooms[ req.query[ 'room' ] ].turnOn();
    } else if ( app.rooms[ req.query[ 'light' ] ] ) {
        //TODO
    } else {
        app.rooms.forEach( function( room ) {
            element.turnOn();
        } );
    }
    res.status( 200 ).send();
} );

application.get( '/light_off', function( req, res ) {
    ongoingEffect = false;
    app.hue.setLightsOff();
    res.status( 200 ).send();
} );

application.get( '/fire', function( req, res ) {
    res.status( 200 ).send();
    ongoingEffect = true;

    function restartFire() {
        if ( ongoingEffect ) {
            setTimeout( function() {
                app.hue.setFire( req.query[ 'room' ] );
                restartFire();
            }, 500 );
        }
    }
    restartFire();
} );

application.listen( 3001, "0.0.0.0", function() {
    console.log( "ready" );
} );



var j = schedule.scheduleJob('*/15 * * * * *', function(){
    app.rooms['Palier'].checkState(function(state){
        console.log(state);
        if (state) {
            setTimeout( function() {
             app.rooms['Palier'].turnOff();
            }, 2*60*1000 );
        }
    });
});