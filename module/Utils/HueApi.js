var NodeHueApi = require( 'node-hue-api' ).HueApi;
var Config = require( './Config' );

var HueApi = function( config ) {
    this.config = config;
    this.startConnection();
}

HueApi.prototype.startConnection = function() {
    console.log(this.config);
    this.api = NodeHueApi( this.config.hue.host, this.config.hue.user );
    this.api.getDescription( function( err, config ) {
        if ( err ) {
            console.log( 'erreur lors de la connexion au bridge' );
            console.log( err );
            return;
        }
        console.log( 'connexion au bridge réussie' )
    } );
};

module.exports = HueApi;