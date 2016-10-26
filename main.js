var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {
    extended: false
} );

var Config = require( './module/Utils/Config' );
var Database = require( './module/Utils/Database' );
var HueApi = require( './module/Utils/HueApi' );

//Init
var config = Config.get( '../../config.yml' );
var db = new Database( config );
var hue = new HueApi();

var app = {
    config: config,
    db: db,
    hue: hue
}

var app = express();

app.get( '/informations', function( req, res ) {
    hue.api.getDescription( function( err, config ) {
        if ( err ) {
            console.log( 'erreur lors de la connection au bridge' );
            console.log( err );
            return;
        }
        console.log( config );
        response.status( 200 ).send( config );
    } );
} );

app.get( '/startFire', function( req, res ) {
    //todo
} );

// ...