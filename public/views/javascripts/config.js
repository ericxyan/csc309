angular.module('goodteam.config',['ui.bootstrap', 'ngRoute'])
.config(function($routeProvider, $locationProvider, $httpProvider){
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
    .when('/admin/user/:userId', {
      templateUrl: '/views/profile.html',
      controller: 'InfoCtrl'
    })

    // Project Admin
    .when('/admin/project/:projectID', {
      templateUrl: '/views/projectAdmin.html',
      controller: 'projectAdmin'
    })

    .when('/projects/apply/:projectID', {
      templateUrl: '/views/projectApply.html',
      controller: 'projectApply'
    })

    .otherwise({
      redirectTo: '/'
    });
});