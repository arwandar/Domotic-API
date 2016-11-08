var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {
    extended: false
} );

var Config = require( './module/Utils/Config' );
var Database = require( './module/Utils/Database' );
var HueInterface = require('./module/Utils/HueInterface');

//Init
var config = Config.get( '../../config.yml' );
// var db = new Database( config );
var hue = new HueInterface(config);

var app = {
    config: config,
    // db: db,
    hue: hue
};

var application = express();

application.get( '/informations', function( req, res ) {
    app.hue.api.getDescription(function (err, conf) {
        if ( err ) {
            console.log( 'erreur lors de la connection au bridge' );
            console.log( err );
            return;
        }
        console.log( conf );
        res.status( 200 ).send( conf );
    } );
} );

application.get('/light_up', function (req, res) {
    app.hue.getLightsOn();
    res.status(200).send();
} );

application.get('/light_off', function (req, res) {
    app.hue.getLightsOff();
    res.status(200).send();
});

application.listen(3001, "0.0.0.0", function () {
  console.log("ready");
});