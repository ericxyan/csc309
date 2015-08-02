angular.module('goodteam.controllers', ['ui.bootstrap', 'ngRoute'])
/*Home page*/
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

/*Register page*/
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

/*Login page*/
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

/*carousel controller*/
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

/*User info page*/
.controller('userInfoCtrl', function ($scope, $http, $routeParams, $route, $location) {
  // Get user info
  $http.get('api/users/' + $routeParams.userId).success(function (res) {
    $scope.user = res;
  });
})

/*User admin page*/
.controller('userAdminCtrl', function ($scope, $http, $routeParams, $route, $location) {
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
})

/*Project info page*/
.controller('projectInfoCtrl', function ($scope, $http, $routeParams){
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
})

/*Project admin page*/
.controller('projectAdmin', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });

})

/*Create new project page*/
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
