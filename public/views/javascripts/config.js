angular.module('goodteam.config',['ui.bootstrap', 'ngRoute', 'valdr'])
.config(function($routeProvider, $locationProvider, $httpProvider, valdrProvider){
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

/* valdr validation*/
  valdrProvider.addConstraints({
    "signIn": {
      "UserId": {
        "required": {
          "message": "Username is required."
        },
        "size": {
          "min": 3,
          "max": 10,
          "message": "Username must be between 4 and 10 characters."
        }
      },
      "Pwd": {
        "required": {
          "message": "Password is required."
        },
        "size": {
          "min": 8,
          "max": 20,
          "message": "Password must be between 6 and 12 characters."
        },
        "pattern": {
          "value": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/,
          "message": "Password between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, but cannot contain whitespace."
        }
      }
    },
    // Sign up validation
    "signUp": {
      "UserId": {
        "required": {
          "message": "Username is required."
        },
        "size": {
          "min": 3,
          "max": 10,
          "message": "Username must be between 3 and 10 characters."
        },
        "pattern": {
          "value": /^\S*$/, // no space allowed.
          "message": "No space allowed."
        }
      },
      "NickName": {
        "required": {
          "message": "Nickname is required."
        },
        "size": {
          "min": 3,
          "max": 10,
          "message": "Username must be between 3 and 10 characters."
        },
        "pattern": {
          "value": /^\S*$/, //no space
          "message": "No space allowed."
        }
      },
      "Email": {
        "email": {
          "message": "Invalide email address."
        }
      },
      "Ceil": {
        "pattern": {
          "value": /^[0-9]*$/, //only numbers
          "message": "only numbers allowed."
        } 
      },
      "Pwd": {
        "required": {
          "message": "Password is required."
        },
        "size": {
          "min": 8,
          "max": 20,
          "message": "Password must be between 6 and 12 characters."
        },
        "pattern": {
          "value": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/,
          "message": "Password between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, but cannot contain whitespace."
        }
      },
      "newPwd": {
        "size": {
          "min": 8,
          "max": 20,
          "message": "Password must be between 6 and 12 characters."
        },
        "pattern": {
          "value": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/,
          "message": "Password between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, but cannot contain whitespace."
        }
      }
    }
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