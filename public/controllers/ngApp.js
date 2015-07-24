var app = angular.module('goodteam', ['ui.bootstrap']);

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

app.controller('carousel', function($scope) {
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
