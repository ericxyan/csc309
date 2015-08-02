var app = require('./app'),
    should = require('should'),
    request = require('supertest'),
    bodyParser = require('body-parser'),
    user1 = request.agent('./app')

app.use(bodyParser.json());


describe('apis', function(){
   
   it('Check Getting projects', function(done){
       request(app)
       .get('/api/projects')
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body.should.be.an.Array();
           done();
       })
   });
   
   it('Check Getting single project goodTeam', function(done){
       request(app)
       .get('/api/projects/55b26d88483e267619bef085')
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body[0].ProjectName.should.equal('GoodTeam');
           done();
       })
   });

   
   it('login', function(done){
       user1
       .post('/auth/login')
       .send({username: 'shayu', password: '456456456'})
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
       })
        request(app)
       .get('/api/projects/55b26d88483e267619bef085')
       .expect(200)
       .end(function(err, res){
           res.status.should.equal(200);
           res.body[0].ProjectName.should.equal('GoodTeam');
           done();
       })
   });

    
});


