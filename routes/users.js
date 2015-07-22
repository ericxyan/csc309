var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('HOLA!');
});

router.get('/id', function(req, res, next) {
  res.send('fuckyou!');
});

module.exports = router;
