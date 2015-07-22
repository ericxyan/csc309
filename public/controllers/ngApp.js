var app = angular.module('goodteam', ['ui.bootstrap']);

app.controller('homeProjectCtrl', function ($scope) {
  $scope.isCollapsed = false;
  $scope.projects = 
[
  { 
    "ProjectName": "goodteam",
    "Description": "123 description",
    "Start_time": '2015-07-20',
    "Finish_time": '2015-07-20',
    "Status": "22",
    "Admin": "Alic, Eric, Gary"
  },
  { 
    "ProjectName": "goodteam",
    "Description": "123 description",
    "Start_time": '2015-07-20',
    "Finish_time": '2015-07-20',
    "Status": "51",
    "Admin": "Alic, Eric, Gary"
  },
  { 
    "ProjectName": "goodteam",
    "Description": "123 description",
    "Start_time": '2015-07-20',
    "Finish_time": '2015-07-20',
    "Status": "99",
    "Admin": "Alic, Eric, Gary"
  }
];

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
