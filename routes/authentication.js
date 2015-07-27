var express = require('express');
var router = express.Router();

module.exports = function(passport){

	// success login
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	// failure login
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalide username or password"});
	});

	// log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	// sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	// log out
	router.get('/signout', function(req, res){
		req.logout();
		res.redirect('/');
	})

	return router;
}