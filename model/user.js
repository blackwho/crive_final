// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var schema = mongoose.Schema;


// define the schema for our user model
var userSchema = new schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
    // google           : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // }


    name :{
        type: String
    },
    details :{
        type: String    
    },
    city :{
        type: String
        
    },
    instagram :{
        type: String
    },
    profilePic : {
        type: schema.Types.Mixed,
    }

});


// var userAdminSchema = new schema({

//     name :{
//         type: String,
//         required: true,
//         unique: true
//     },
//     email :{
//         type: String,
//         required: true,
//         unique: true
//     },
//     details :{
//         type: String,
        
//     },
//     city :{
//         type: String
        
//     },
//     instagram :{
//         type: String,
//         unique: true
//     }
//     userProfilePic : {
//         type: String
//     }

// });


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var user = mongoose.model('userDetails', userSchema);
//var userAdmin = mongoose.model('userAdminDetails', userAdminSchema);

module.exports = user;
//module.exports = userAdmin;