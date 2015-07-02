var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 = require('bcrypt-nodejs');

// reservation schema 
var ReservationSchema   = new Schema({
	booth_id : String,
	user_id : String,
	dt_start: String,
	dt_booked: String,
	dt_cancelled: String,
});


module.exports = mongoose.model('Reservation', ReservationSchema);
