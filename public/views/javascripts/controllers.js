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

////////////////////////
//Navbar controller/ //
////////////////////////
.controller('nvaCtrl', function ($scope, $modal, skills, $log){
  // Open register modal
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: '/views/registerModal.html',
      controller: 'registerModal',
      size: size,
    });

    modalInstance.result.then(function (newUser) {
      $scope.newUser = newUser;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());      
    });
  };
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
      text: 'blablabla...'
    },
    {
      image: '/views/img/2.jpg',
      text: 'blablabla...'
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
      $http.get('api/users/' + $routeParams.userId).success(function (res) {
        // init rating obj.
        $scope.user = res; // query user
        $scope.rating.RaterId = user._id; // visitor
      });
    };
  });

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
//////////////////////
//Project info page //
//////////////////////
.controller('projectInfoCtrl', function ($scope, $http, $routeParams){
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
})

///////////////////////
//Project admin page //
///////////////////////
.controller('projectAdmin', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
})

////////////////////////////
//Create new project page //
////////////////////////////
.controller('projectApply', function ($scope, $http, $routeParams) {
  $scope.apply=function(){
    var newProject = $scope.project;
    newProject.Start_time= Date();
    /*more details to be filled in for this project, not done yet*/
    newProject.Admin;
    $http.post('/projects', newProject).success(function(response){
      
    });
    
  };
  
  
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
});
