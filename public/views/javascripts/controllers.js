angular.module('goodteam.controllers', ['ui.bootstrap', 'ngRoute'])
.controller('homeProjectCtrl', function ($scope, $http) {
  $scope.isCollapsed = false;
  $scope.search = function (key) {
    if(key === ""){
      getProjects();
    } else {
      $http.get('/api/projects/name/' + $scope.searchKey)
      .success(function (data) {
        $scope.projects = data;
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

});

app.controller('authController', function ($scope, $rootScope, $http, $location, $route){
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

app.controller('InfoCtrl', function ($scope, $http, $routeParams, $route, $location) {

  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){
      $location.path('/login');
    }
    else {
      $http.get('api/users/' + $routeParams.userId).success(function (res) {
        $scope.user = res;
      });
    }
  });
});

app.controller('projectAdmin', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });

});

app.controller('projectApply', function ($scope, $http, $routeParams) {
  $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
    $scope.project = res[0];
  });
});