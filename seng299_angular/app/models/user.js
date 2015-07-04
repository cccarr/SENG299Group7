var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	first_name: String,
	last_name: String,
	phone: String,
	email: String,
	username: String,
	password: { type: String, required: true, select: false },
	description: String,
	dt_ban_end: String,
	security_question: String,
	security_answer: String	

});


// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

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


// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
/*
var userSchema = mongoose.Schema({

    local            : {
	name         : String,
        email        : String,
        password     : String,
	birthday     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('local.password')) return next();
		//user.local.password = bcrypt.hashSync(user.local.password, bcrypt.genSaltSync(8), null);
		next();
	// generate the hash

});


// checking if password is valid
userSchema.methods.validPassword = function(password) {
	
	return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);
*/
