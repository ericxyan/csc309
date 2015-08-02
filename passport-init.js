var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = require('./db/user');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var GOOGLE_CLIENT_ID = "1072897989763-gimelnk9s37nshper63c6pmp41qk3fpd.apps.googleusercontent.com"
var GOOGLE_CLIENT_SECRET  = "gcDp3j5KIEFl2OTzhIR1ligW";

module.exports = function(passport){
	// Local login strategy
	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// check in mongo if a user with username exists or not
			User.findOne({ 'UserId' :  username }, 
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with username '+username);
						return done(null, false);                 
					}
					// User exists but wrong password, log the error 
					if (isValidPassword (user, password)){ //!isValidPassword(user, password)
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					return done(null, user);
				}
			);
		}
	));

	// Local signup stategy
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			// find a user in mongo with provided username
			User.findOne({ 'UserId' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err);
				}
				// already exists
				if (user) {
					console.log('User already exists with username: '+username);
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();
					console.log(req.body);
					// set the user's local credentials
					newUser.UserId = req.body.user.UserId;
					newUser.Pwd = createHash(req.body.userPwd);
					newUser.NickName = req.body.user.NickName;
					newUser.Email = req.body.user.Email;
					newUser.Ceil = req.body.user.Ceil;
					newUser.Skills = req.body.user.Skills;

					// save the user
					newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log(newUser.UserId + ' Registration succesful');    
						return done(null, newUser);
					});
				}
			});
		})
	);
	
	// Google strategy
	passport.use(new GoogleStrategy({
	    clientID:     GOOGLE_CLIENT_ID,
	    clientSecret: GOOGLE_CLIENT_SECRET,
	    callbackURL: "https://csc309-loveplmm.c9.io/auth/google/callback",
	    passReqToCallback   : true
	  },
	  function(request, accessToken, refreshToken, profile, done) {
	  	process.nextTick(function () {
	      User.findOne({ UserId: profile.id }, function (err, user) {
	      	if(user === null){
	      	new User({UserId: profile.id, NickName: profile.displayName, Email: profile.emails[0].value})
        		.save(function(err, docs){
        			return done(err, docs);
        		});
	      	} else {
	      	return done(err, user);}
	      });
	    });
	  }));

	// serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done){
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.Pwd);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
}