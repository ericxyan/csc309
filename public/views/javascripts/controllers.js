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

/*Login page*/
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

  // Register a new user
  $scope.register = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      alert('our form is amazing');
    }

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
})

/*Validation*/
.controller('MainController', function($scope,$q) {

    $scope.passwordPattern = /(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    $scope.validEmail = function(email) {

        var deferred = $q.defer(); //promise
        setTimeout(function() {
            deferred.resolve([ "nitin.sarma@gmail.com", "nitin@gmail.com" ].indexOf(email) === -1);
        }, 1000);
        return deferred.promise;
    };
})
/*Validation directives*/
// validate username
.directive('validUsername', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                // Any way to read the results of a "required" angular validator here?
                var isBlank = viewValue === ''
                var invalidChars = !isBlank && !/^[A-z0-9]+$/.test(viewValue)
                var invalidLen = !isBlank && !invalidChars && (viewValue.length < 5 || viewValue.length > 20)
                ctrl.$setValidity('isBlank', !isBlank)
                ctrl.$setValidity('invalidChars', !invalidChars)
                ctrl.$setValidity('invalidLen', !invalidLen)
                scope.usernameGood = !isBlank && !invalidChars && !invalidLen

            })
        }
    }
})
// password match
.directive("ngEquals", function() {
        var directive = { };

        directive.restrict = 'A';
        directive.require = 'ngModel';
        directive.scope = {
            original: '=ngEquals'
        };

        directive.link = function(scope, elm, attrs, ngModel) {
            ngModel.$parsers.unshift(function(value) {
                ngModel.$setValidity('equals', scope.original === value);
                return value;
            });
        };

        return directive;
    })
.directive("ngFiltered", function() {
            var directive = { };

            directive.restrict = 'A';
            directive.require = 'ngModel';
            directive.scope = {
                filter: '&ngFiltered'
            };

            directive.link = function(scope, elm, attrs, ngModel) {
                ngModel.$parsers.unshift(function(value) {
                    var result = scope.filter({
                        $value: value
                    });
                    if (typeof result.then === "function") {
                        result.then(function(result) {
                            ngModel.$setValidity('filtered', result);
                        });
                    } else {
                        ngModel.$setValidity('filtered', result);
                    }
                    return value;
                });
            };

            return directive;
        });

