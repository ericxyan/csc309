var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		console.log(req.user);
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	// Google login
	router.get('/google', passport.authenticate('google', {
	 scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read']  
	}));
	// Google login callback
	router.get('/google/callback', passport.authenticate('google', {
       successRedirect: '/auth/success',
       failureRedirect: '/auth/failure'
	}));
	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	// route to test if the user is logged in or not
	router.get('/loggedin', function (req, res) {
		res.send(req.isAuthenticated()? req.user: '0');
	});

	return router;

};