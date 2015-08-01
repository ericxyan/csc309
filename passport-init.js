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
					if (password != user.Pwd){ //!isValidPassword(user, password)
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

					// set the user's local credentials
					newUser.UserId = username;
					newUser.Pwd = createHash(password);

					// save the user
					newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log(newUser.username + ' Registration succesful');    
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
	    //NOTE :
	    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
	    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
	    //then edit your /etc/hosts local file to point on your private IP. 
	    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
	    //if you use it.
	    callbackURL: "https://csc309-loveplmm.c9.io/auth/google/callback",
	    passReqToCallback   : true
	  },
	  function(request, accessToken, refreshToken, profile, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	      
	      // To keep the example simple, the user's Google profile is returned to
	      // represent the logged-in user.  In a typical application, you would want
	      // to associate the Google account with a user record in your database,
	      // and return that user instead.
	      console.log(profile);
	      return done(null, {id: profile.displayName, name: profile.displayName});
	    });
	  }
	));

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
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
}