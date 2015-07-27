var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var users = {};

module.exports = function(passport){
	// serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done){
		console.log('serializing user: ', user.username);
		return done(null, user.username);
	});

	passport.deserializeUser(function(username, done){
		return done(null, users[username]);
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback: true
		},
		function(req, username, password, done) {
			if(users[username]){
				console.log('User Not Found with username: ' + username);
				return done(null,false);
			}

			if(isValidPassword(user, password)){
				return done(null, users[username]);
			}
			else{
				console.log('Invalid password');
				return done(null,false);
			}
		})
	);

	passport.use('signup', new LocalStrategy({
			passReqToCallback: true
		}, 
		function(req, username, password, done){
			if(users[username]){
				console.log(username + 'already exists');
				return done(null,false);
			}

			users[username] = {
				username: username,
				password: createHash(password)
			}

			console.log(users[username].username + 'registered!');
			return done(null, users[username]);
		})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	}

	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}