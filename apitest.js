var app = require('./app');
var should = require('should');
var request = require('supertest');
var server = request.agent(app);
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = require('./db/user');
var Project = require('./db/projects');
var Rating  = require('./db/rating');
var Comment = require('./db/comments');

var testProject, testUser;
var pwd = bCrypt.hashSync("AliceAliceMock", bCrypt.genSaltSync(10), null)



describe('apis', function(){
    
    before(function(done){
        new Project({
	        "ProjectName": "Mock project",
	        "Description": "abcdefg",
	        "Subjects": ["EE", "CS"],
	        "Status": 20,
        }).save(function(err, doc){
            testProject = doc;
        });
    
        new User({
            "UserId": "MockAliceAlice",
            "Pwd": pwd,
            "NickName": "AliceXianYu"
        }).save(function(err, doc){
            testUser = doc;
        });
        done();
    });

    after(function(done){
        Project.find({"ProjectName": "Mock project"}).remove().exec();
        User.find({"UserId": "MockAliceAlice"}).remove().exec();
        done();
    });
    
    
    it('Check getting user with userId', function(done){
      server
      .get('/api/users/MockAliceAlice')
      .expect(200)
      .end(function(err, res){
          res.status.should.equal(200);
          res.body.Pwd.should.equal(testUser.Pwd);
          done();
      });
    });
   
    it('Check username and password should return null', function(done){
      server
      .get('/api/users/abcd/abcc')
      .expect(200)
      .end(function(err, res){
          res.status.should.equal(200);
          res.text.should.equal('null');
          done();
      });
   });
    
    it('Check NickName should return false', function(done){
      server
      .get('/api/users/valid/nickname/' + testUser.NickName)
      .expect(200)
      .end(function(err, res){
          res.status.should.equal(200);
          res.text.should.equal('false');
          done();
      });
   });
    
   it('Check Getting projects', function(done){
       server
       .get('/api/projects')
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body.should.be.an.Array();
           done();
       });
   });
   
   it('Check Getting single project goodTeam', function(done){
       server
       .get('/api/projects/' + testProject._id)
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body[0].ProjectName.should.equal(testProject.ProjectName);
           done();
       });
   });
   
   it('Getting all ratings of a single user, should return array', function(done){
      server
      .get('/api/rating/' + testUser._id)
      .expect(200)
      .end(function(err, res){
          res.status.should.equal(200);
          res.body.should.be.an.Array();
          done();
      });
   });
   
   
   it('Getting all ratings of a single user, should return array', function(done){
      server
      .get('/api/comment/' + testProject._id)
      .expect(200)
      .end(function(err, res){
          res.status.should.equal(200);
          res.body.should.be.an.Array();
          done();
      });
   });

   it('Check put project without logged in', function(done){
       server
       .put('/api/projects/' + testProject._id)
       .expect(302)
       .end(function(err, res){
           res.status.should.equal(302);
           res.text.should.equal('Moved Temporarily. Redirecting to /');
           done();
       })
   });
   
   it('Check Login, all logged in after this', userLogin);
   
      
   it('Check create user', function(done){
       var mockUser = {
            "UserId": "MockAlice",
            "Pwd": "AliceMock",
            "NickName": "XianYu"
           
       };
       var id;
       server
       .post('/api/users/')
       .send(mockUser)
       .expect(200)
       .end(function(err, res){
          res.status.should.equal(200);
          res.text.should.containEql('Created');
          User.find({"UserId":"MockAlice"}).remove().exec();
          done();
       });
   });
   
   it('Check update UserInfo', function(done){
       server
       .put('/api/users/')
       .send({user:{_id: testUser._id, Ceil: "789456123"}})
       .expect(200)
       .end(function(err, res){
          res.status.should.equal(200);
          res.body.Ceil.should.equal("789456123");
          done();
       });
   });
      
   it('Check create and delete project', function(done){
       var mockProject = {
	        "ProjectName": "Mock",
	        "Description": "abcdefg",
	        "Subjects": ["EE", "CS"],
	        "Status": 20,
        };
       var id;
       server
       .post('/api/projects/')
       .send(mockProject)
       .expect(200)
       .end(function(err, res){
          res.status.should.equal(200);
          res.body.ProjectName.should.equal('Mock');
          res.body.Status.should.equal(20);
          id = res.body._id;
          server
          .delete('/api/projects/' + id)
          .expect(200)
          .end(function(err, res){
            res.status.should.equal(200);
            res.text.should.equal('success');
            done();
        });
       });
   });
   
   it('Check put project', function(done){
       // TODO: need to create a mock project here
       server
       .put('/api/projects/' + testProject._id)
       .send({"Status": 70})
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body.Status.should.equal(70);
           done();
       });
   });
   
   it('Check create new rating', function(done){
        var mockRating = {
            "RaterId": testUser._id,
            "Stars": 5,
            "Comment": "This is mock rating"
        };
       server
       .post('/api/rating/' + testUser._id)
       .send(mockRating)
       .expect(200)
       .end(function(err, res){
          res.status.should.equal(200);
          res.text.should.equal('success');
          Rating.find({Comment: "This is mock rating"}).remove().exec();
          done();
       });
   });
   
   
   it('Check create new comment', function(done){
        var mockComment = {
            "UserId": testUser._id,
            "Content": "This is mock comment"
        };
       server
       .post('/api/comment/' + testProject._id)
       .send(mockComment)
       .expect(200)
       .end(function(err, res){
          res.status.should.equal(200);
          res.text.should.equal('success');
          Comment.find({"Content": "This is mock comment"}).remove().exec();
          done();
       });
   });
   
   it('check logged in session', function(done){
       server
       .get('/auth/loggedin')
       .expect(200)
       .end(function(err, res){
           res.text.should.containEql('haha');
           done();
       });
   });
   
   it('Check log out ', function(done){
      server
      .get('/auth/signout')
      .expect(200)
      .end(function(err, res){
         res.text.should.containEql('success');
         done();
      });
   });
});


function userLogin(done){
        server
       .post('/auth/login')
       .type('form')
       .send({username: 'haha', password: '123'})
       .expect(302)
       .end(function(err, res){
           res.status.should.equal(302);
           done();
       });
};


