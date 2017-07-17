// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../model/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))




    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session:true,
        passReqToCallback: true
      },
      function(req, email, password, done){
        process.nextTick(function(){
          console.log('Here', req.body);
          console.log('User', email);
          User.findOne({ 'local.email': email}, function(err, user){
            if(err)
            {
              console.log('error');
              return done(err);
            }
            if(!user)
            {
              console.log('nouser');
              return done(null, false);              
            }
            // if(!user.validPassword(password)){
            //      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // }
            if(user.local.password != password){
              console.log('nopass');
              return done(null, false);
            }
            console.log(user);
            return done(null, user);

          });
        });
      }
    ));




    // code for signup (use('local-signup', new LocalStategy))

    //for Facebook
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ["emails", "photos", "displayName"]

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                console.log(profile);

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.name.displayName;
                    user.facebook.email = profile.emails[0].value;

                    user.save(function(err){
                        if(err)
                            throw err;

                        return done(null, user); // user found, return that user

                    });

                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
