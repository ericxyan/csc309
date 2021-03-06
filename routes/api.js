var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../db/user');
var Project = require('../db/projects');
var Rating  = require('../db/rating');
var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.Pwd);
};
// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isAuthenticated = function (req, res, next) {
    // allows GET without authentication
    if(req.method === 'GET'){
        return next();
    }
    if(req.isAuthenticated()){
        return next();
    }

    // not authenticated 
    return res.redirect('/');
}

router.use('/projects', isAuthenticated);

/* ---------- search -----------*/

/*
Search all users with Skill
*/

router.get('/search/skill/:skill', function(req, res, next){
    User.find({'Skills': req.params.skill})
    .exec(function(err, docs){
       if(err){
           res.status(500).send('Something broke');
       } 
       res.json(docs); // return a array of users with certain skill.
    });
});

/*
Search projects's Admin with given user
*/
router.get('/search/project/Admin/:userId', function(req, res, next){
   Project.find({'Admin': mongoose.Types.ObjectId(req.params.userId)})
   .exec(function(err, docs){
      if(err){
           res.status(500).send('Something broke');
       } 
       res.json(docs); 
   });
});

/*
Search projects's Admin with given user
*/
router.get('/search/project/Member/:userId', function(req, res, next){
   Project.find({'Member': mongoose.Types.ObjectId(req.params.userId)})
   .exec(function(err, docs){
      if(err){
           res.status(500).send('Something broke');
       } 
       res.json(docs); 
   });
});

/*
Search projects's Admin with given user
*/
router.get('/search/project/Candidate/:userId', function(req, res, next){
   Project.find({'Candidate': mongoose.Types.ObjectId(req.params.userId)})
   .exec(function(err, docs){
      if(err){
           res.status(500).send('Something broke');
       } 
       res.json(docs); 
   });
});
/* ---------- for users ---------- */





/*
Get all users in a list of json.
*/
router.get('/users/', function(req, res, next) {
    User.find()
        .exec(function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
            res.send(doc);
        });
});




/*
 Get one user
*/
router.get('/users/:userid', function(req, res, next) {
    User.findOne({"UserId":req.params.userid})
        .populate('Rating')
        .populate('Projects')
        .exec(function(err, docs){
            if(err){
                res.status(500).send("Something broke!");
            }
        res.json(docs);
    });
});

/*
Get users by keywords
 */
router.get('/users/name/:userid', function(req, res, next) {
    var keyWords = "\.*" + req.params.userid + "*\.";
    User.find({"UserId": new RegExp(keyWords, 'i')})
        .exec(function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.json(doc);
    });
});


/*
 Get users json with given id and pwd, null if no user found.
*/
router.get('/users/:id/:pwd', function(req, res, next) {
    User.findOne({"UserId":req.params.id, "Pwd":req.params.pwd})
        .exec(function(err, docs){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.json(docs);
    });
});


/*
 Update user's information with given id.
*/
router.put('/users', function(req, res, next) {
    req.body.user.Pwd = createHash(req.body.user.Pwd);
    User.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.body.user._id)}, req.body.user)
        .exec(function(err, docs){
        if(err){
            res.status(500).send("Invalide Nickname!");
        }
        User.findById(docs._id).exec(function(err, docs){
            if(err){
                res.status(500).send("Something broke!");
            }
            res.json(docs);
        });
    });
});

/*
 Post a new User, return the json of this project from db.
*/
router.post('/users', function(req, res, next) {
    new User(req.body)
        .save(function(err, docs){
        if(err){
            res.status(500).send("Something broke!");
        }
        //res.json(docs);
        res.send({message:'Created a new user!'});
    });
});

/*
 Delete a user
 */
router.delete('/users/:id', function(req, res, next) {
    User.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id))
        .exec(function(err){
        if(err){ 
            res.status(500).send("Something broke!");
        }
        res.send("Success: deleted user " + req.params.id);
    });
});

/*
Check whether the given nickname is valid
*/

router.get('/users/valid/nickname/:nickname', function(req, res, next){
   User.findOne({"NickName": req.params.nickname}).exec(function(err, doc){
      if(err){
          res.status(500).send("Something broke!");
      }
      else if(doc){
          res.send("false");
      }
      else{
          res.send("true");
      }
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
            res.status(500).send("Something broke!");
        }
            res.send(doc);
        });
});


/*
 Get one projects with given project _id.
*/
router.get('/projects/:id', function(req, res, next) {
    Project.find({"_id": mongoose.Types.ObjectId(req.params.id)})
        .populate('Candidate')
        .populate('Comments')
        .populate('Member')
        .populate('Admin')
        .exec(function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.json(doc);
    });
});

/*
Search projects with projectName
*/
router.get('/projects/name/:projectName', function(req, res, next) {
    var keyWords = "\.*" + req.params.projectName + "*\.";
    Project.find({"ProjectName": new RegExp(keyWords, 'i')})
        .exec(function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
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
            res.status(500).send("Something broke!");
        }
        res.json(docs);
    });
});


/*
 Update the project with given _id, return the revised version json.
*/
router.put('/projects/:id', function(req, res, next) {
    Project.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.id)}, req.body)
        .exec(function(err, docs){
        if(err){
            res.status(500).send("Something broke!");
        }
        Project.findById(docs._id)
        .exec(function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.json(doc);
    });
    });
});

/*
 Delete the project with given _id, return the revised version json.
*/
router.delete('/projects/:id', function(req, res, next) {
    Project.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id))
        .exec(function(err){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.send("success");
    });
});



/* ---------- api for Rating ---------- */


/*
Populate out the user's ratings, and return the ratings.
*/
router.get('/rating/:id', function (req, res, next) {
    User.findById(mongoose.Types.ObjectId(req.params.id), function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        User.populate(doc, {path: "Rating"}, function(err, doc){
            if(err){
            res.status(500).send("Something broke!");
            }
            res.send(doc.Rating);
        });
    });
});


/*
Add new Rating to the specific user
*/
router.post('/rating/:userId', function (req, res, next) {
    new Rating(req.body).save(function(err, docs){
        if(err){
            res.status(500).send("Something broke!");
        }
        else{
            User.findOneAndUpdate({"_id": mongoose.Types.ObjectId(req.params.userId)}, 
                                {$push: {"Rating": docs._id}},function(err){
                if(err){
                    res.status(500).send("Something broke!");
                }
                cptAvg(mongoose.Types.ObjectId(req.params.userId),res);
                res.send("success");
            });
        }
    });
});

var cptAvg = function(userId, res){
    var lst = [];
    User.findById(mongoose.Types.ObjectId(userId), function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        User.populate(doc, {path: "Rating"}, function(err, doc){
            if(err){
            res.status(500).send("Something broke!");
            }
            else{
            User.findOneAndUpdate({"_id": mongoose.Types.ObjectId(userId)}, 
                                        {$set: {"AvgRating": helper(doc.Rating)}},function(err){
                if(err){
                    console.log(err);
                    res.status(500).send("Something broke!");
                }
            });
            }
        });
    });
    
};

var helper = function(lst){
    var sum = 0;
    for(var i = 0; i < lst.length; i++){
        sum += lst[i].Stars;
    }
    return lst.length===0? 0 : sum / lst.length;
}



/*
Delete Rating.
*/

router.delete('/rating/:userid/:ratingId', function(req, res, next) {
    User.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.userid)},{$pull : {"Rating" : mongoose.Types.ObjectId(req.params.ratingId)}}, function(err){
            if(err){
                res.status(500).send("Something broke!");
            }
    });
    Rating.findByIdAndRemove(mongoose.Types.ObjectId(req.params.ratingId))
        .exec(function(err){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.send("success");
    });
});

/* ---------- api for Comments ---------- */


/*
Populate out the project's comments, and return the comments.
*/
router.get('/comment/:id', function(req, res, next) {
    Project.findById(mongoose.Types.ObjectId(req.params.id), function(err, doc){
        if(err){
            res.status(500).send("Something broke!");
        }
        else{
            Project.populate(doc, {path: "Comment"}, function(err, doc){
                if(err){
                    res.status(500).send("Something broke!");
                }
                res.send(doc.Comments);
            });
        }
    });
});


/*
Add new Comment to the specific project
*/
router.post('/comment/:projectId', function(req, res, next) {
    new Comment(req.body)
        .save(function(err, docs){
        if(err){
            res.status(500).send("Something broke!");
        }
        else{
        Project.findOneAndUpdate(mongoose.Types.ObjectId(req.params.projectId), {$push: {"Comments": docs._id}},function(err){
            if(err){
                res.status(500).send("Something broke!");
            }
            res.send("success");
            });
        }
    });
});

/*
Delete Comment.
*/

router.delete('/comment/:projectId/:commentId', function(req, res, next) {
    Project.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.params.projectId)},{$pull : {"Comments" : mongoose.Types.ObjectId(req.params.commentId)}}, function(err){
            if(err){
                res.status(500).send("Something broke!");}
    });
    Comment.findByIdAndRemove(mongoose.Types.ObjectId(req.params.commentId))
        .exec(function(err){
        if(err){
            res.status(500).send("Something broke!");
        }
        res.send("success");
    });
});
module.exports = router;