var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// login page
router.get('/login', function(req, res, next) {
  res.render('login');
});

// Register page
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/project/:projectID', function(req, res, next) {
  res.render('projectDetail');
});


module.exports = router;
