
var mongoose = require('mongoose');
var schema = mongoose.Schema;


var userSchema = new schema({

	name :{
		type: String,
		required: true,
		unique: true
	},
	email :{
		type: String,
		required: true,
		unique: true
	},
	details :{
		type: String,
		
	},
	city :{
		type: String
		
	},
	instagram :{
		type: String,
		unique: true
	},
	userProfilePic : {
		type: String
	}

});

var user = mongoose.model('userAdminDetails', userSchema);
var user = mongoose.model('userDetails', userSchema);


module.exports = user;
