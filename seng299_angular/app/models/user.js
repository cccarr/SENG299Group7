var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	first_name: String,
	last_name: String,
	phone: String,
	email: String,
	username: { type: String, required: true, index: { unique: true }},
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
	if (!user.isModified('local.password')) return next();
		//user.local.password = bcrypt.hashSync(user.local.password, bcrypt.genSaltSync(8), null);
		next();
	// generate the hash

});


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
