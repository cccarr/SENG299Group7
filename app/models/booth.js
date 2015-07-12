var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 	 = require('bcrypt-nodejs');

// booth schema 
var BoothSchema   = new Schema({
	booth_type : String,
	booth_title : String,
});


module.exports = mongoose.model('Booth', BoothSchema);
