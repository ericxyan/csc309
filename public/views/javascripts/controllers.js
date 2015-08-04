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
      console.log("here!");
      $http.get('api/search/project/Admin/'+$scope.user._id).success(function(res){
      $scope.admin_projects=res;
      console.log(res);
    });
    $http.get('api/search/project/Member/'+$scope.user._id).success(function(res){
      $scope.member_projects=res;
    });
    $http.get('api/search/project/Candidate/'+$scope.user._id).success(function(res){
      $scope.candidate_projects=res;
    });


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
    if(user.UserId !== $routeParams.userId){
      $location.path('/');
    }
    else { // logged in
      $http.get('api/users/' + $routeParams.userId).success(function (res) {
        $scope.user = res;
        $http.get('api/search/project/Admin/'+$scope.user._id).success(function(res){
      $scope.admin_projects=res;
      console.log(res);
    });
    $http.get('api/search/project/Member/'+$scope.user._id).success(function(res){
      $scope.member_projects=res;
    });
    $http.get('api/search/project/Candidate/'+$scope.user._id).success(function(res){
      $scope.candidate_projects=res;
    });
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
  $scope.max = 10;
  $scope.rating = {
    'RaterId': '',  // Rater id
    'Stars': 5, 
    'Comments': ''
  };
  /*check login status*/
  $http.get('auth/loggedin').success(function (user){
    if(user ==='0'){
      document.getElementById("applyMember").remove();
      //document.getElementById("applyMember").innerHTML="Log in to apply";
      document.getElementById("ratefield").remove();
      //document.getElementById("postComment").innerHTML="Log in to comment";
      document.getElementById("Administrate").remove();
    }
    else{
      $scope.user=user;
      $scope.myComment.UserId=user._id;
      $scope.rating.RaterId = user._id;
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
          if(user._id !== res[0].Admin._id){
            document.getElementById("Administrate").remove();         
          }
          else{
            document.getElementById("applyMember").remove();
          }
          var canRate=false;
          for(var i=0; i< res[0].Member.length;i++){
          if(user._id === res[0].Member[i]._id){
            var isMember=true;
            console.log("You are member of this group");
            }
          }
          if(user._id===res[0].Admin._id || isMember===true){
            if(res[0].Status===100){
                canRate=true;
            }
          }
          if(canRate==true){
            console.log("you can rate now");
          }
          else{
            document.getElementById("ratefield").remove();
          }

      });
    }
  });

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  // post rating obj
  $scope.addRating = function(){
    console.log($scope.rating);
    var sel= document.getElementById('sel1');
    var ratedId = sel.options[sel.selectedIndex].value;
    $http.post('/api/rating/' + ratedId, $scope.rating).success(function (data) {
      console.log($scope.rating);
      console.log(ratedId);
      $scope.rating.Stars = 5;
      $scope.rating.Comments = '';
      alert("rating done!");
    });
  };


  var refresh = function(){
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
      $scope.project = res[0];
      $scope.memberList=[$scope.project.Admin];
      });

  };
  refresh();
  $scope.apply=function(){
    var Dup=false;
    var Done=false;
    for(var i=0; i< $scope.project.Candidate.length;i++){
      if($scope.user._id === $scope.project.Candidate[i]._id){
        Dup=true;
        alert("You can't apply twice!");
      }
    }
    if($scope.project.Status===100){
      Done=true;
      alert("The project has already finished");
    }
    if(!Dup && !Done){
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
          if($scope.project.Status ===100){
            document.getElementById("updateprog").remove();
            $scope.project.Candidate=[];
            $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
              console.log("success");
            });

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
        refresh();
      });
    }
  };
  $scope.deleteProject=function(){
    $http.delete('/api/projects/'+$routeParams.projectID).success(function(res){
      alert("success");
      $location.path('/');
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
      $scope.project={ProjectName:'',
      Description:'',
      Subjects:[],
      Start_time:'',
      Finish_time:'',
      Status:0,
      Admin:$scope.user._id,
      Member:[],
      Candidate:[],
      Comments:[]
    };
    }
  });
  $scope.apply=function(){
    var newProject = $scope.project;
    newProject.Start_time= Date();
    var subjectList=[];
    var form=document.getElementById("subject");
    for(var i=0; i<form.elements.length; i++){
      if(form.elements[i].checked){
        subjectList.push(form.elements[i].value);
      }
    }
    newProject.Subjects=subjectList;
    console.log(newProject);
    if($scope.project.ProjectName===''){
      alert("You must fill in the project name!");
    }
    else{
    $http.post('/api/projects', newProject).success(function(response){
      alert("Create new project successfully!");
    }); 
    $location.path('/');  
    }
  };
});