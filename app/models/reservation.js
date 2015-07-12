var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 = require('bcrypt-nodejs');

// reservation schema 
var ReservationSchema  = new Schema({
	booth_id : String,
	user_id : String,
	dt_start: Date,
	dt_booked: Date,
	dt_cancelled: Date,
});


module.exports = mongoose.model('Reservation', ReservationSchema);
