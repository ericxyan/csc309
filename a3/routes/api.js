var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../db/user');
var Project = require('../db/projects');



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
    User.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.id)}, req.body).exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/* ---------- api for projects ---------- */


/*
Get all projects in a list of json.
*/
router.get('/projects/', function(req, res, next) {
    Project.find().exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/*
 Get one projects with given project _id.
 */
router.get('/projects/:id', function(req, res, next) {
    Project.find({"_id": mongoose.Types.ObjectId(req.params.id)}).exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/*
 Post a new project, return the json of this project from db.
 */
router.post('/projects', function(req, res, next) {
    new Project(req.body).save(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs)
    });
});




module.exports = router;