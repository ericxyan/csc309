var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../db/user');
var Project = require('../db/projects');
var Rating  = require('../db/rating');
var Comment = require('../db/comments');



/* ---------- for users ---------- */


/*
 Get all users in a list of json
*/
router.get('/users/', function(req, res, next) {
    User.find()
        .exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/*
 Get users json with given id and pwd, null if no user found.
*/
router.get('/users/:id/:pwd', function(req, res, next) {
    User.findOne({"UserId":req.params.id, "Pwd":req.params.pwd})
        .exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/*
 Update user's information with given id.
*/
router.put('/users/:id', function(req, res, next) {
    User.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.id)}, req.body)
        .exec(function(err, docs){
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
    Project.find()
        .exec(function(err, doc){
        if(err){
            res.send("err");
        }
            res.send(doc)
        });
});


/*
 Get one projects with given project _id.
*/
router.get('/projects/:id', function(req, res, next) {
    Project.find({"_id": mongoose.Types.ObjectId(req.params.id)})
        .exec(function(err, doc){
        if(err){
            res.send("err");
        }
        res.json(doc);
    });
});


/*
 Post a new project, return the json of this project from db.
*/
router.post('/projects', function(req, res, next) {
    new Project(req.body)
        .save(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs)
    });
});


/*
 Update the project with given _id, return the revised version json.
*/
router.put('/projects/:id', function(req, res, next) {
    Project.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.id)}, req.body)
        .exec(function(err, docs){
        if(err){
            res.send("err");
        }
        res.json(docs);
    });
});


/*
 Delete the project with given _id, return the revised version json.
*/
router.delete('/projects/:id', function(req, res, next) {
    Project.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), req.body)
        .exec(function(err){
        if(err){
            res.send("err");
        }
        res.send("success");
    });
});


/* ---------- api for Rating ---------- */


/*
Populate out the user's ratings, and return the ratings.
*/
router.get('/rating/:id', function(req, res, next) {
    User.findById(mongoose.Types.ObjectId(req.params.id), function(err, doc){
        User.populate(doc, {path: "Rating"}, function(err, doc){
            res.send(doc.Rating);
        });
    });
});


/*
Add new Rating to the specific user, return the promise of this action
*/
router.post('/rating/:id', function(req, res, next) {
    new Rating(req.body)
        .save(function(err, docs){
        if(err){
            res.send("err");
        }
        User.update(mongoose.Types.ObjectId(req.params.id), {$push: {"Rating": docs._id}},function(err){
            if(err){
                res.send("err");}
            res.send("success");
            
        });
    });
});

/*
Delete Rating.
*/



module.exports = router;