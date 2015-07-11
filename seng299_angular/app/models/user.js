var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 	 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	name: String,
	phone: String,
	email: String,
	username: { type: String, required: true },
	password: { type: String, required: true, select: false },
	description: String,
	dt_ban_end: String,
	security_question: String,
	security_answer: String,
	isAdmin: Boolean	

});



<<<<<<< HEAD

=======
// hash the password before the user is saved
>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9
UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();
<<<<<<< HEAD

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};
=======

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
>>>>>>> 523a462986137c02ddf9adead556e2f1ee36fbe9


// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
