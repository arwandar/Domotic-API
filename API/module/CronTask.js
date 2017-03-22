var schedule = require( 'node-schedule' );

var CronTask = function( app ) {
    this.app = app
    var self = this;

    var j = schedule.scheduleJob( '*/30 * * * * *', function() {
        self.app.rooms[ 'Palier' ].extinctionAuto( 2 * 60 );
    } );
};

module.exports = CronTask;