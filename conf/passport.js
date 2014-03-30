// config/passport.js

var LocalStrategy   = require('passport-local').Strategy;
var User       		= require('../db/schema').User;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

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
	passport.use('local-test', new LocalStrategy({
	      usernameField : 'email',
	      passwordField : 'password',
	      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	  function(req,email, password, done) {
	    console.log("here local test " + username + "," + password)
        console.log("login strat " + email + "|" + password);
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
            	console.log("err: " + err);
                // if there are any errors, return the error
                if (err)
                    return done(err);

            	console.log("user: " + user);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, {'loginMessage': 'No user found.'});

            	console.log("valid pass");
                if (!user.validPassword(password)){
	            	console.log("no");
                    return done(null, false, {'loginMessage': 'Oops! Wrong password.'});
                }
                else{
	            	console.log("yup");
                    return done(null, user);
                }
            });
        });	  }
	));
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        console.log("login strat " + email + "|" + password);
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
            	if(err) console.log("err: " + err);
                // if there are any errors, return the error
                if (err)
                    return done(err);

            	console.log("user found? " + user ? "yep" : "nope");
                // if no user is found, return the message
                if (!user)
                    return done(null, false, {'message': 'No user found.'});

                if (!user.validPassword(password)){
	            	console.log("   Invalid pass");
                    return done(null, false, {'message': 'Oops! Wrong password.'});
                }
                else{
	            	console.log("   All good");
                    return done(null, user, {'message': 'yay'});
                }
            });
        });

    }));


    passport.use('local-adduser', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    	console.log("add user!" + email + "," + password + ","); console.log(req.body);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        console.log("user: " +  req.user);
	    if (!req.user) {
	        return done(null, false, {'message': 'You are not logged in'});
	    // if the user is logged in but has no local account...
	    } else {
	        User.findOne({ 'local.email' :  email }, function(err, user) {
	        	console.log("err?: " +  err);
	            // if there are any errors, return the error
	            if (err)
	                return done(err);

	        	console.log("user exists?: ");console.log(user);
	            // check to see if theres already a user with that email
	            if (user) {
	                return done(null, false, {'status': 'fail', 'message' : 'That email is already taken.'});
	            } else {

	                var newUser            = new User();
	                newUser.local.email    = email;
	                newUser.local.password = newUser.generateHash(password);
	                newUser.local.role = req.body.role;
	                newUser.local.first_name = req.body.first_name;
	                newUser.local.last_name = req.body.last_name;

	        		console.log("new user: ");console.log(newUser);
					// save the user
	                newUser.save(function(err) {
	                    if (err){
	                        throw err;
	                	}
	                    return done(null, req.user);
	                });
	            }
	        });    
    	}

        });

    }));

};