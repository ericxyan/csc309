var app = angular.module('goodteam', ['goodteam.config', 'goodteam.controllers' ,'ui.bootstrap', 'ngRoute', 'ngCookies']);

app.run(function($rootScope, $http, $route) {
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


