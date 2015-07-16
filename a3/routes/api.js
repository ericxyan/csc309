var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../db/user');



/* ---------- for users ---------- */
router.get('/users/', function(req, res, next) {
    User.find().exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});

router.get('/users/:id/:pwd', function(req, res, next) {
    User.findOne({"UserId":req.params.id, "Pwd":req.params.pwd}).exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});

router.put('/users/:id', function(req, res, next) {
    User.findOneAndUpdate({"_id":req.params.id}, req.body).exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});



module.exports = router;