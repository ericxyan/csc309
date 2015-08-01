angular.module('goodteam.controllers', ['ui.bootstrap', 'ngRoute'])
// Home page
.controller('homeProjectCtrl', function ($scope, $http) {
  //$scope.isCollapsed = false;
  // Search function
  $scope.search = function (key) {
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

  $scope.parseInt = function(project){
    project.Status = parseInt(project.Status);
  }

})

// Login page
.controller('authController', function ($scope, $rootScope, $http, $location, $route){
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

  // register a new user
  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
})

// carousel controller
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

// Project detail page
.controller('projectDetailCtrl', function ($scope, $http, $routeParams){
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
})

// User info page
.controller('InfoCtrl', function ($scope, $http, $routeParams, $route, $location) {
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

// project admin page
.controller('projectAdmin', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });

})

// Create new project page
.controller('projectApply', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
});