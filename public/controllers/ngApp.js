var app = angular.module('goodteam', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

app.run(function($rootScope, $cookieStore, $http, $route) {
  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){
      $rootScope.authenticated = false;
      $rootScope.current_user = '';
    }
    else {
      $rootScope.authenticated = true;
      $rootScope.current_user = user.UserId;
    }
  });

  $rootScope.signout = function(){
      $http.get('auth/signout').success(function (data){
          $rootScope.authenticated = false;
          $rootScope.current_user = '';
          $route.reload();
      });

  };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'homeProjectCtrl',
      disableCache: true
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

    // Project Admin
    .when('/projects/admin/:projectID', {
      templateUrl: '/views/projectAdmin.html',
      controller: 'projectAdmin'
    })

    .when('/projects/apply/:projectID', {
      templateUrl: '/views/projectApply.html',
      controller: 'projectApply'
    })

    .otherwise('/');
});

app.controller('homeProjectCtrl', function ($scope, $http, $cookieStore) {

  /* ngCookie test */
  // Put cookie
  //$cookieStore.put('myFavorite','oatmeal');
  // Get cookie
  //$scope.favoriteCookie = $cookieStore.get('myFavorite');
  // Removing a cookie
  //$cookieStore.remove('myFavorite');

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

app.controller('authController', function ($scope, $http, $location, $route, $rootScope, $location, $cookieStore){
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

app.controller('InfoCtrl', function ($scope, $http, $routeParams) {
  $http.get('api/users/' + $routeParams.userId).success(function (res) {
    $scope.user = res;
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
})