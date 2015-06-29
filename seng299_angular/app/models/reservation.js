var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// reservation schema 
var ReservationSchema   = new Schema({
	name: String,
	reservationname: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// hash the password before the reservation is saved
ReservationSchema.pre('save', function(next) {
	var reservation = this;

	// hash the password only if the password has been changed or reservation is new
	if (!reservation.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(reservation.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		reservation.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
ReservationSchema.methods.comparePassword = function(password) {
	var reservation = this;

	return bcrypt.compareSync(password, reservation.password);
};

module.exports = mongoose.model('Reservation', ReservationSchema);
