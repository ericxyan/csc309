var app = angular.module('goodteam', ['ui.bootstrap', 'ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'homeProjectCtrl'
    })
    //the login display
    .when('/login', {
      templateUrl: '/views/login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'authController'
    })

    // Project detail page
    .when('/projects/:projectID', {
      templateUrl: '/views/projectDetail.html',
      controller: 'projectDetailCtrl'
    })

    // Profile
    .when('/user/:userId', {
      templateUrl: '/views/profile.html',
      controller: 'InfoCtrl'
    })
});

app.controller('homeProjectCtrl', function ($scope, $http) {
  $scope.isCollapsed = false;
  
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

});

app.controller('authController', function ($scope){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $scope.error_message = 'login request for ' + $scope.user.username;
  };

  $scope.register = function(){
    $scope.error_message = 'registeration request for ' + $scope.user.username;
  };
});

app.controller('carousel', function ($scope) {
  $scope.slideInterval = 3000;
  var slides = $scope.slides = [    {
      image: '/views/img/1.jpg',
      text: 'blablabla...'
    },
    {
      image: '/views/img/2.jpg',
      text: 'blablabla...'
    }];
});

app.controller('projectDetailCtrl', function ($scope, $http, $routeParams){
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
});

app.controller('InfoCtrl', function ($scope, $http, $routeParams) {
  $http.get('api/users/' + $routeParams.userId).success(function (res) {
    $scope.user = res;
  });

});