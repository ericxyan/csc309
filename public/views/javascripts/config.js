angular.module('goodteam.config',['ui.bootstrap', 'ngRoute'])
.config(function($routeProvider, $locationProvider, $httpProvider){
  $routeProvider
    // Home page
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'homeProjectCtrl',
      disableCache: true
    })
    // Login page
    .when('/login', {
      templateUrl: '/views/login.html',
      controller: 'signInCtrl'
    })
    // Register page
    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'signUpCtrl'
    })
    // User info page
    .when('/users/:userId', {
      templateUrl: '/views/userInfo.html',
      controller: 'userInfoCtrl'
    })
    // Admin user info page
    .when('/admin/user/:userId', {
      templateUrl: '/views/userAdmin.html',
      controller: 'userAdminCtrl'
    })
    // Project info page
    .when('/projects/:projectID', {
      templateUrl: '/views/projectInfo.html',
      controller: 'projectInfoCtrl'
    })
    // Project admin page
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
})
/*Services*/
.factory('skills', function(){
  var skills = {
    'Computer Science': false,
    'Statistics': false,
    'Electrical Engineering': false,
    'Commerce': false
  };
  return skills;
});