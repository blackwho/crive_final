var express = require('express');
var router = express.Router();
var User = require('../model/user');
const fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
//var AdminDetails = require('../model/adminDetails');
var multer   =  require( 'multer' );
var upload   =  multer({ storage : multer.memoryStorage()});
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'vroy', 
  api_key: '182646376985325', 
  api_secret: 'nqMpWO66YGE-eV3EVrT2yGNY4_0' 
});

var nodeMailer=require('nodemailer');
var config = require("../config.js");
var mailConfig=config.mailConfig;
var transport = nodeMailer.createTransport(mailConfig);

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo





module.exports = function(passport){


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req, res, next){
	res.render('index', {title: 'Login'});
});

router.get('/register', function(req, res, next){
	res.render('index', {title: 'Register'});
});

router.get('/adminInfo', function(req, res, next){

  if(req.isAuthenticated()){
	 res.render('index', {title: 'Admin Info'});
  }
  else{
    res.redirect('/login');
  }

});



router.get('/public', function(req, res){
  res.render('index', {title: 'Public Profile'});
});

router.get('/public/:id', function(req, res){
  res.render('index', {title: 'Public Profile'});
});

router.post('/login',
                passport.authenticate('local-login',{failureRedirect: '/login'}),
                function(req, res, next) {
        console.log(req.user);
        console.log(req.body);
        console.log(req.isAuthenticated());
        console.log(req.session);
        req.session.cookie.maxAge = 30 * 24 *60*60*1000;
        console.log("done");
        res.json({'s':'p'});
        //res.redirect('/adminInfo');
    });





router.post('/adminInfo', upload.single('file'), function(req, res, next){

      // var path = '';


      User.findById(req.user.id, function(err,user){
        user.name = req.body.username;
        if(req.body.email)
          user.local.email = req.body.email;
        user.details = req.body.paragraph;
        user.city = req.body.cityName;
        user.instagram = req.body.instagramUsername;

         //  upload(req, res, function (err) {
         //  if (err) {
         //    // An error occurred when uploading
         //    console.log(err);
         //    return res.status(422).send("an Error occured")
         //  }  
         // // No error occured.
         //  path = req.file.path;
         //  return res.send("Upload Completed for "+path); 
         //  });     

        user.save(function(err, saveUser){
              if(err){
                  throw err;
              }
              
              console.log(saveUser);
              res.json({'s':'p'});
              //res.redirect('/login');
         });

     });

});

router.post('/admin/profilePicUpload', upload.single('file'), function(req, res, next){
      console.log(req.file);
        var data = req.file.buffer;
        //var upDir = path.resolve(__dirname, '../public/images/poster/');
        //var newPath =  upDir+"/"+req.headers.title+".jpg";
        cloudinary.uploader.upload_stream(function(result){
            User.findById(req.user.id, function(err,user){
                console.log("I am result:" +result);
                user.profilePic = result;
                user.markModified('profilePic');
                user.save(function(err,savedPost){
                    if(err){
                        throw err;
                    }
                    console.log("old Movie Edited",savedPost);
                    res.json({s:'p', d: savedPost._id});
                    //return done(null, savedUser);
                });
            });
        }).end( req.file.buffer );
});

router.post('/register', function(req, res, next) {
        User.findOne({'local.email':req.body.email}, function(err,userEmail){
            if(err){
                throw err;
            }
            if(userEmail){
                res.json({'s':'f', d:'user_exist'});
            }
            else{
                var newUser = new User();
                newUser.local.email = req.body.email;
                newUser.local.password = req.body.password;
                newUser.save(function(err,saveUser){
                    if(err){
                        throw err;
                    }
                    console.log(saveUser);
                    res.json({'s':'p'});
                });

            }

        }) 

    });

router.get('/admin/fetch', function(req, res){

  //console.log("This is my own ID:" + req);
  console.log("My Id is:" +req.user.id);
  User.findById(req.user.id, function(err,user){
      if(err)
        throw err;
      if(!user)
        res.json({s: 'f'});
      else
        res.json({s: 'p', d: user});
    });
});

// router.get('/public/fetch', function(req, res){
//   res.render('index', {title: 'Public Profile'});
// });



router.post('/public', function(req, res){

  var id = req.body.userId;

  User.findById(mongoose.Types.ObjectId(id), function(err,user){
      if(err)
        throw err;
      if(!user)
        res.json({s: 'f'});
      else
        res.json({s: 'p', d: user});
    });
});



router.post('/public/fetch', function(req, res){

  var id = req.body.uid;

  User.findById(mongoose.Types.ObjectId(id), function(err,user){
      if(err)
        throw err;
      if(!user)
        res.json({s: 'f'});
      else
        res.json({s: 'p', d: user});
    });
});

router.post('/public/contact', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var uid = req.body.userId;
    console.log(req.body);


    User.findById(mongoose.Types.ObjectId(uid), function(err,user){
      if(err)
        throw err;
      if(!user)
        res.json({s: 'f'});
      else{
        if("local" in user)
          var userEmail = user.local.email;
        else
          var userEmail = user.facebook.email;
        var sub = "iProfile - New contact Message";
        var mailOptions={
          from: '"'+name+'" <'+email+'>',
          to: userEmail,
          subject: sub,
          text: message
        };     
        transport.sendMail(mailOptions,function(err, msg)
        {
          /**
          * If there is error while sending the mail, log error.
          */
          if(err)
          {
            console.log("having-email-error");
            console.log(err);
            res.json({s: 'f'});
          }
          /**
          * Else log Message-sent.
          */
          else
          {
            console.log("message-sent");
            res.json({s: 'p'});
          }
        });               
        
      }
    });
  });


  //route for facebook authentication and login
  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));


  // handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/adminInfo',
            failureRedirect : '/login'
        }));


router.get('/logout', function(req, res){

  if(req.isAuthenticated())
    req.logout();

  res.json({s: 'p'});
});



//authentication check function

  function isLoggedIn(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user)
        return next();
    

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
}





return router;
}