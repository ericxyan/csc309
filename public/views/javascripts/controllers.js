angular.module('goodteam.controllers', ['ui.bootstrap', 'ngRoute'])
//////////////
//Home page //
//////////////
.controller('homeProjectCtrl', function ($scope, $http) {
  // Search function
  $scope.search = function (key) {
    // empty search words
    if(key === ""){
      getProjects();
      $scope.users = [];
    } else {
      //search projects
      $http.get('/api/projects/name/' + $scope.searchKey)
      .success(function (data) {
        $scope.projects = data;
      });
      //search users
      $http.get('/api/users/name/' + $scope.searchKey)
      .success(function (data) {
        $scope.users = data;
      });
    }
  }; 

  // fetch projects data
  var getProjects = function (){
    $http.get('/api/projects').success(function(res){
      $scope.projects = res;
    });
  }

  getProjects();

  // parse project.status to int.
  $scope.parseInt = function(project){
    project.Status = parseInt(project.Status);
  }
})
//////////////////////
//Search controller //
//////////////////////
.controller('searchCtrl', function ($scope, $http, $location, $routeParams){

  $scope.search = function (key) {
    // empty search words
    if(key === ""){
      getProjects(key);
      $scope.users = [];
    } else {
      //search projects
      $http.get('/api/projects/name/' + key)
      .success(function (data) {
        $scope.projects = data;
      });
      //search users
      $http.get('/api/users/name/' + key)
      .success(function (data) {
        $scope.users = data;
      });
    }
  }; 
  // fetch projects data
  var getProjects = function (key){
    $http.get('/api/projects' + key).success(function(res){
      $scope.projects = res;
    });
  }

  // parse project.status to int.
  $scope.parseInt = function(project){
    project.Status = parseInt(project.Status);
  }
$scope.search($routeParams.searchKey);
})

////////////////////////
//Navbar controller/ //
////////////////////////
.controller('navCtrl', function ($scope, $modal, skills, $log, $location, $routeParams){
  // Open Sign up modal
  $scope.openSignUp = function (size) {
    var signUpModal = $modal.open({
      animation: true,
      templateUrl: '/views/registerModal.html',
      controller: 'registerModal',
      size: size,
    });

    signUpModal.result.then(function (newUser) {
      $scope.newUser = newUser;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());      
    });
  };
  // Open Sign in modal
  $scope.openSignIn = function (size) {
    var signInModal = $modal.open({
      animation: true,
      templateUrl: '/views/signInModal.html',
      controller: 'signInModalCtrl',
      size: size,
    });

    signInModal.result.then(function (user) {
      $scope.user = user;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());   //error   
    });
  };
  // Search box
  $scope.searchLink = function () {
    $location.path('/search/' + $scope.searchKey);
  }; 
})

//////////////////////////////
// Sign in modal controller //
//////////////////////////////
.controller('signInModalCtrl', function ($scope, $http, $location, $modalInstance, $rootScope){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.ok = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.UserId;
        $modalInstance.close(data);
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }      
    });
  };

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
})


//////////////////////////////
//Register modal controller //
//////////////////////////////
.controller('registerModal', function ($scope, $http, $location, $rootScope, $modalInstance, skills) {
  $scope.skills = skills;
  $scope.error_message = '';
  $scope.user = {
    UserId: '',
    Pwd: '', 
    NickName: '',
    Email: '',
    Ceil: '',
    Skills: []
  };

  var check = function(){
        Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.user.Skills.push(key);
      }
    });
  }
  // Register a new user
  $scope.ok = function () {
    $scope.register();
    $location.path('/')
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.register = function() {
    // check selected skills
    check();
    
    // signup
    $http.post('/auth/signup', {username: $scope.user.UserId, password: $scope.user.Pwd, user: $scope.user}).success(function(data){
          if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.UserId;
            $modalInstance.close($scope.user);
          }
          else{
            $scope.error_message = data.message;
          }
    });
  };
})
//////////////////
//Register page //
//////////////////
.controller('signUpCtrl', function ($scope, $rootScope, $http, $location, $route, skills){
  $scope.skills = skills;
  $scope.error_message = '';
  $scope.user = {
    UserId: '',
    Pwd: '', 
    NickName: '',
    Email: '',
    Ceil: '',
    Skills: []
  };

  var check = function(){
        Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.user.Skills.push(key);
      }
    });
  }
  // Register a new user
  $scope.register = function() {
    // check selected skills
    check();
    
    // signup
    $http.post('/auth/signup', {username: $scope.user.UserId, password: $scope.user.Pwd, user: $scope.user}).success(function(data){
          if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.UserId;
            $location.path('/');
          }
          else{
            $scope.error_message = data.message;
          }
    });
  };
})

///////////////
//Login page //
///////////////
.controller('signInCtrl', function ($scope, $rootScope, $http, $location, $route){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.UserId;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
})

////////////////////////
//carousel controller //
////////////////////////
.controller('carousel', function ($scope) {
  $scope.slideInterval = 3000;
  var slides = $scope.slides = [    {
      image: '/views/img/1.jpg',
      text: 'blablabla...',
      url: '#/projects/55b26d88483e267619bef085'
    },
    {
      image: '/views/img/2.jpg',
      text: 'blablabla...',
      url: '#/projects/55b26d88483e267619bef085'
    }];
})

///////////////////
//User info page //
///////////////////
.controller('userInfoCtrl', function ($scope, $http, $routeParams, $route, $location) {
  $scope.max = 10;
  $scope.rating = {
    'RaterId': '',  // Rater id
    'Stars': 5, 
    'Comments': ''
  };
  // Check if logged in
  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){ //not login
      $location.path('/login');
    }
    else { // logged in
        getUserInfo();
        $scope.rating.RaterId = user._id; // visitor
    };
  });

  var getUserInfo = function(){
    $http.get('api/users/' + $routeParams.userId).success(function (res) {
      $scope.user = res; // query user
    });
  };
  // hover display rate
  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  // post rating obj
  $scope.addRating = function(){
    $http.post('/api/rating/' + $scope.user._id, $scope.rating).success(function (data) {
      $scope.message = data;
      $scope.rating.Stars = 5;
      $scope.rating.Comments = '';
      getUserInfo();
    });
  };
})

////////////////////
//User admin page //
////////////////////
.controller('userAdminCtrl', function ($scope, $http, $routeParams, $route, $rootScope, $location, $modal, $log) {
  // Check login status
  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){ //not login
      $location.path('/login');
    }
    else { // logged in
      $http.get('api/users/' + $routeParams.userId).success(function (res) {
        $scope.user = res;
      });
    }
  });
  
  // update info modal
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: '/views/userUpdateModal.html',
      controller: 'userUpdateModal',
      size: size,
      resolve: {
        oriInfo: function () {
          return $scope.user;
        }
      }
    });

    modalInstance.result.then(function (newInfo) {
      $scope.user = newInfo;
      $location.path('/admin/user/'+$scope.user.UserId);
      $rootScope.current_user = $scope.user.UserId;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

// Rating
  $scope.rate = 5;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.addRating = function(){
  };
})
/////////////////////////////////////////////////
//User admin info page update modal controller //
/////////////////////////////////////////////////
.controller('userUpdateModal', function ($scope, $http, $modalInstance, oriInfo, skills) {
  $scope.skills = skills;
  $scope.newInfo = angular.copy(oriInfo);
  var check = function(){
      $scope.newInfo.Skills = [];
      Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.newInfo.Skills.push(key);
      }
    });
  }
  $scope.ok = function () {
    //update user info
    check();
    $http.put('/api/users', {user: $scope.newInfo}).success(function(docs){
      $modalInstance.close($scope.newInfo);
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
///////////////////////////
//////Project info page////
///////////////////////////
.controller('projectInfoCtrl', function ($scope, $http, $routeParams){
  $scope.myComment={
    'UserId':'',
    'Time':'',
    'Content':''
  };
  /*check login status*/
  $http.get('auth/loggedin').success(function (user){
    if(user =='0'){
      document.getElementById("applyMember").disabled=true;
      document.getElementById("applyMember").innerHTML="Log in to apply";
      document.getElementById("postComment").disabled=true;
      document.getElementById("postComment").innerHTML="Log in to comment";
      document.getElementById("Administrate").style.display="none";
    }
    else{
      $scope.user=user;
      $scope.myComment.UserId=user._id;
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
          if(user._id !== res[0].Admin._id){
            document.getElementById("Administrate").style.display="none";          
          }
          else{
            document.getElementById("applyMember").disabled=true;
          }
      });
    }
  });

  var refresh = function(){
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
      $scope.project = res[0];
      });

  };
  refresh();
  $scope.apply=function(){
    for(var i=0; i< $scope.project.Candidate.length;i++){
      if($scope.user._id === $scope.project.Candidate[i]._id){
        var Dup=true;
        alert("You can't apply twice!");
      }
    }
    if(!Dup){
      $scope.project.Candidate.push($scope.user._id);
      console.log($scope.user._id);
      $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
        console.log("success");
      });
      refresh();
    }
  };
  $scope.addPost=function(){
    $scope.myComment.Time=Date();
    $http.post('/api/comment/'+$routeParams.projectID, $scope.myComment).success(function(res){
      console.log("success");
    });
    refresh();
  };
})



///////////////////////
//Project admin page///
///////////////////////
.controller('projectAdmin', function ($scope, $http, $routeParams,$location) {

  var refresh = function(){
  $http.get('auth/loggedin').success(function (user){
    if(user==='0'){
      $location.path('/login');
    }
    else{
        $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
          $scope.project = res[0];
          if(user._id !== res[0].Admin._id){
            $location.path('/');
          }
        });
      }
    });
  };
  refresh();

  $scope.deleteMember=function(id){
    var i=0;
    console.log($scope.project.Member);
    for(var i = $scope.project.Member.length; i--;) {
          if($scope.project.Member[i]._id === id) {
              $scope.project.Member.splice(i, 1);
              console.log("delete!");
          }
    }
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
  };


  var deleteCandidate=function(id){
    var i=0;
    console.log(id);
    console.log($scope.project.Candidate);
    for(var i = $scope.project.Candidate.length; i--;) {
          if($scope.project.Candidate[i]._id === id) {
              $scope.project.Candidate.splice(i, 1);
              console.log("delete!");
          }
    }
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
  };
  $scope.accept=function(id){
    $scope.project.Member.push(id);
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
    deleteCandidate(id);
    refresh();
  };
  $scope.reject=function(id){
    deleteCandidate(id);
    refresh();
  };
  $scope.updateProg=function(){
    if($scope.prog>100 || $scope.prog <0){
        alert("not in proper range");
    }
    else{
      $scope.project.Status = $scope.prog;
      $http.put('/api/projects/'+ $routeParams.projectID, $scope.project).success(function(res){
        alert("success");
      });
    }
  };
  $scope.deleteProject=function(){
    $http.delete('/api/projects/'+$routeParams.projectID).success(function(res){
      alert("success");
    });
  };

})


///////////////////////////////////
///////Create new project page/////
///////////////////////////////////
.controller('projectApply', function ($scope, $http, $routeParams,$location) {
  $http.get('auth/loggedin').success(function (user){
    if(user=='0'){
      $location.path('/login');
    }
    else{
      $scope.user=user;
    }
  });
  $scope.apply=function(){
    var newProject = $scope.project;
    newProject.Start_time= Date();
    newProject.Status=0;
    var subjectList=[];
    var form=document.getElementById("subject");
    for(var i=0; i<form.elements.length; i++){
      if(form.elements[i].checked){
        subjectList.push(form.elements[i].value);
      }
    }
    newProject.Subjects=subjectList;
    newProject.Admin=$scope.user;
    newProject.Member=[];
    newProject.Comments=[];
    newProject.Candidate=[];
    console.log(newProject);
    $http.post('/api/projects', newProject).success(function(response){
      alert("success");
    }); 
    $location.path('/');  
  };
});