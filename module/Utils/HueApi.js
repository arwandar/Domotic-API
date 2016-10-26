var NodeHueApi = require( 'node-hue-api' );
var Config = require( './Config' );

var HueApi = function( app ) {
    this.app = app;
    this.startConnection();
}

HueApi.prototype.startConnection = function() {
    this.api = new NodeHueApi( this.app.config.hue.host, this.app.config.hue.user );
    api.getDescription( function( err, config ) {
        if ( err ) {
            console.log( 'erreur lors de la connection au bridge' );
            console.log( err );
            return;
        }
        console.log( 'connection au bridge réussie' )
    } );
};

module.exports = HueApi;