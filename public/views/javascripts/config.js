angular.module('goodteam.config',['ui.bootstrap', 'ngRoute'])
.config(function($routeProvider, $locationProvider, $httpProvider){
  $routeProvider
    // Home page
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'homeProjectCtrl',
      disableCache: true
    })
    .when('/search/:searchKey', {
      templateUrl: '/views/search.html',
      controller: 'searchCtrl',
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
    // Create new project
    .when('/apply', {
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
    'MongoDB.js': false,
    'Express.js': false,
    'Angular.js': false,
    'MongoDB': false,
    'Bootstrap': false,
    'Python': false
  };
  return skills;
})
/*Search user result*/
.factory('searchedUsers', function(){
  var users = [];
  return {
    set: function(){
      return users;
    },
    get: function(result){
      users = angular.copy(result);
    },
    clean: function(){
      users = [];
    }
  };
})
/*Search projects result*/
.factory('searchedProjects', function(){
  var projects = [];
  return {
    set: function(){
      return projects;
    },
    get: function(result){
      projects = angular.copy(result);
    },
    clean: function(){
      projects = [];
    }
  };
})
.factory('searchKeys', function(){
  var keys = '';
  return {
    set: function(str){
      keys = str;
    },
    get: function(){
      return keys;
    }
  };
})