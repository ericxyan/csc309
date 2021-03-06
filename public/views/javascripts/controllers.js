angular.module('goodteam.controllers', ['ui.bootstrap', 'ngRoute'])

//////////////////////////////////////////////
////////Admin with the highest previlege//////
//////////////////////////////////////////////
.controller('alladmin', function ($scope, $http, $location) {
  $http.get('auth/loggedin').success(function (user){
    if(user.admin !=='admin'){
      $location.path('/');
    }
    });

  var refresh= function(){
      $http.get('/api/projects').success(function(res){
      $scope.projects = res;
      $scope.projectTotal = $scope.projects.length;
      });
      $http.get('/api/users').success(function(res){
          $scope.users = res;
          $scope.userTotal = $scope.users.length;
      });
  };  

  refresh();

  $scope.deleteProject=function(id){
    $http.delete('/api/projects/'+id).success(function(res){
      alert("delete success");
      
  });
    refresh();
  };

  $scope.deleteUser=function(id){
    $http.delete('/api/users/'+id).success(function(res){
      alert("delete success");  
  });
    refresh();
  };

})


//////////////
//Home page //
//////////////
.controller('homeProjectCtrl', function ($scope, $http, skills) {
  $scope.skills = skills;
  $scope.searchedSkill = '';
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

  // Search skills
  $scope.searchSkill = function (skill){
    $scope.projects = [];
    $scope.searchedSkill = skill;
    $http.get('/api/search/skill/' + skill)
    .success(function (data) {
      $scope.users = data;
    });
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
//////////////////////
//Search controller //
//////////////////////
.controller('searchCtrl', function ($scope, $http, $location, $routeParams){

  $scope.search = function (key) {
    // empty search words
    if(key === ""){
      getProjects(key);
      $scope.users = [];
    } else {
      //search projects
      $http.get('/api/projects/name/' + key)
      .success(function (data) {
        $scope.projects = data;
      });
      //search users
      $http.get('/api/users/name/' + key)
      .success(function (data) {
        $scope.users = data;
      });
    }
  }; 
  // fetch projects data
  var getProjects = function (key){
    $http.get('/api/projects' + key).success(function(res){
      $scope.projects = res;
    });
  }

  // parse project.status to int.
  $scope.parseInt = function(project){
    project.Status = parseInt(project.Status);
  }
$scope.search($routeParams.searchKey);
})

////////////////////////
//Navbar controller/ //
////////////////////////
.controller('navCtrl', function ($scope, $modal, skills, $log, $location, $routeParams){
  // Open Sign up modal
  $scope.openSignUp = function (size) {
    var signUpModal = $modal.open({
      animation: true,
      templateUrl: '/views/registerModal.html',
      controller: 'registerModal',
      size: size,
    });

    signUpModal.result.then(function (newUser) {
      $scope.newUser = newUser;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());      
    });
  };
  // Open Sign in modal
  $scope.openSignIn = function (size) {
    var signInModal = $modal.open({
      animation: true,
      templateUrl: '/views/signInModal.html',
      controller: 'signInModalCtrl',
      size: size,
    });

    signInModal.result.then(function (user) {
      $scope.user = user;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());   //error   
    });
  };
  // Search box
  $scope.searchLink = function () {
    $location.path('/search/' + $scope.searchKey);
  }; 
})

//////////////////////////////
// Sign in modal controller //
//////////////////////////////
.controller('signInModalCtrl', function ($scope, $http, $location, $modalInstance, $rootScope, valdr){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.ok = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.UserId;
        $modalInstance.close(data);
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }      
    });
  };

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
})


//////////////////////////////
//Register modal controller //
//////////////////////////////
.controller('registerModal', function ($scope, $http, $location, $rootScope, $modalInstance, skills) {
  $scope.skills = skills;
  $scope.error_message = '';
  $scope.checkMessage = '';
  $scope.match = true;
  $scope.Pwd2='';
  $scope.user = {
    UserId: '',
    Pwd: '', 
    NickName: '',
    Email: '',
    Ceil: '',
    Skills: []
  };
  // Check pwd match
  $scope.checkMatch = function(){
    if($scope.user.Pwd == $scope.Pwd2){
      $scope.match = true;
    }
    else {
      $scope.match = false;
    }
  };

  var check = function(){
        Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.user.Skills.push(key);
      }
    });
  }
  // Register a new user
  $scope.ok = function () {
    $scope.register();
    $location.path('/')
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.register = function() {
    // check selected skills
    check();
    
    // signup
    $http.post('/auth/signup', {username: $scope.user.UserId, password: $scope.user.Pwd, user: $scope.user}).success(function(data){
          if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.UserId;
            $modalInstance.close($scope.user);
          }
          else{
            $scope.error_message = data.message;
          }
    });
  };
})
//////////////////
//Register page //
//////////////////
.controller('signUpCtrl', function ($scope, $rootScope, $http, $location, $route, skills){
  $scope.skills = skills;
  $scope.error_message = '';
  $scope.user = {
    UserId: '',
    Pwd: '', 
    NickName: '',
    Email: '',
    Ceil: '',
    Skills: []
  };

  var check = function(){
        Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.user.Skills.push(key);
      }
    });
  }
  // Register a new user
  $scope.register = function() {
    // check selected skills
    check();
    
    // signup
    $http.post('/auth/signup', {username: $scope.user.UserId, password: $scope.user.Pwd, user: $scope.user}).success(function(data){
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
})

///////////////
//Login page //
///////////////
.controller('signInCtrl', function ($scope, $rootScope, $http, $location, $route){
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
})

////////////////////////
//carousel controller //
////////////////////////
.controller('carousel', function ($scope) {
  $scope.slideInterval = 3000;
  var slides = $scope.slides = [    {
      image: '/views/img/1.jpg',
      text: 'blablabla...',
      url: '#/projects/55b26d88483e267619bef085'
    },
    {
      image: '/views/img/2.jpg',
      text: 'blablabla...',
      url: '#/projects/55b26d88483e267619bef085'
    }];
})

///////////////////
//User info page //
///////////////////
.controller('userInfoCtrl', function ($scope, $http, $routeParams, $route, $location) {
  // Check if logged in
  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){ //not login
      $location.path('/login');
    }
    else { // logged in
        getUserInfo();
    };
  });

  var getUserInfo = function(){
    $http.get('api/users/' + $routeParams.userId).success(function (res) {
      $scope.user = res; // query user
      /*get all the project that the user participate in*/
      $http.get('api/search/project/Admin/'+$scope.user._id).success(function(res){
      $scope.admin_projects=res;
      console.log(res);
      });
    $http.get('api/search/project/Member/'+$scope.user._id).success(function(res){
      $scope.member_projects=res;
      });
    $http.get('api/search/project/Candidate/'+$scope.user._id).success(function(res){
      $scope.candidate_projects=res;
      });


    });

  };
})

////////////////////
//User admin page //
////////////////////
.controller('userAdminCtrl', function ($scope, $http, $routeParams, $route, $rootScope, $location, $modal, $log) {
  // Check login status
  $http.get('auth/loggedin').success(function (user){
    if(user === '0'){ //not login
      $location.path('/login');
    }
    if(user.UserId !== $routeParams.userId){
      $location.path('/');
    }
    else { // logged in
      $http.get('api/users/' + $routeParams.userId).success(function (res) {
        $scope.user = res;
        /*get all the projects the the user participate in*/
        $http.get('api/search/project/Admin/'+$scope.user._id).success(function(res){
        $scope.admin_projects=res;
        console.log(res);
        });
        $http.get('api/search/project/Member/'+$scope.user._id).success(function(res){
          $scope.member_projects=res;
        });
        $http.get('api/search/project/Candidate/'+$scope.user._id).success(function(res){
          $scope.candidate_projects=res;
        });
      });
    }
  });
  
  // update info modal
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: '/views/userUpdateModal.html',
      controller: 'userUpdateModal',
      size: size,
      resolve: {
        oriInfo: function () {
          return $scope.user;
        }
      }
    });

    modalInstance.result.then(function (newInfo) {
      $scope.user = newInfo;
      $location.path('/admin/user/'+$scope.user.UserId);
      $rootScope.current_user = $scope.user.UserId;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
})



/////////////////////////////////////////////////
//User admin info page update modal controller //
/////////////////////////////////////////////////
.controller('userUpdateModal', function ($scope, $http, $modalInstance, oriInfo, skills) {
  $scope.skills = skills;
  $scope.newInfo = angular.copy(oriInfo);
  $scope.error_message = '';
  $scope.newInfo.Pwd = '';
  $scope.repPwd = '';
  $scope.match = true;
  // Check pwd match
  $scope.checkMatch = function(){
    if($scope.newInfo.Pwd == $scope.repPwd){
      $scope.match = true;
    }
    else {
      $scope.match = false;
    }
  };

  var check = function(){
      $scope.newInfo.Skills = [];
      Object.keys($scope.skills).forEach(function(key){
      if($scope.skills[key]){
        $scope.newInfo.Skills.push(key);
      }
    });
  }
  $scope.ok = function () {
    //update user info
    check();
    if($scope.newInfo.Pwd == ''){
      delete $scope.newInfo.Pwd;
      $http.get('/api/users/valid/nickname/' + $scope.newInfo.NickName).success(function(data){
        if(data == "false"){
          $scope.error_message = "Invalid Nickname!";
        }
        else {
          $http.put('/api/users',{user: $scope.newInfo}).success(function(data){
            $modalInstance.close($scope.newInfo);
          });
        }
      });
    }
    else {
      $http.put('/api/users', {user: $scope.newInfo}).success(function(docs){
        $modalInstance.close($scope.newInfo);
      });
    }
  };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})


///////////////////////////
//////Project info page////
///////////////////////////
.controller('projectInfoCtrl', function ($scope, $http, $routeParams){
  $scope.max = 10;
  $scope.rating = {
    'RaterId': '',  // Rater id
    'Stars': 5, 
    'Comments': ''
  };
  /*check login status*/
  $http.get('auth/loggedin').success(function (user){
    if(user ==='0'){
      /*not logged in*/
      document.getElementById("applyMember").remove();
      document.getElementById("ratefield").remove();
      document.getElementById("Administrate").remove();
    }
    else{
      /*get current user in this session*/
      $scope.user=user;
      $scope.rating.RaterId = user._id;
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
          if(user._id !== res[0].Admin._id){
            /*the user is not the administrator of this project*/
            document.getElementById("Administrate").remove();         
          }
          else{
            /*the admin can't apply for his own project*/
            document.getElementById("applyMember").remove();
          }
          /*check whether the user can rate other members, provided that the project is already finished 
          and the the user is a member of the project*/
          var canRate=false;
          for(var i=0; i< res[0].Member.length;i++){
          if(user._id === res[0].Member[i]._id){
            var isMember=true;
            }
          }
          if(user._id===res[0].Admin._id || isMember===true){
            if(res[0].Status===100){
                canRate=true;
            }
          }
          if(canRate==true){
            console.log("you can rate now");
          }
          else{
            document.getElementById("ratefield").remove();
          }
      });
    }
  });
  
  /*for star rating */
  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  // post rating obj
  $scope.addRating = function(){
    console.log($scope.rating);
    var sel= document.getElementById('sel1');
    var ratedId = sel.options[sel.selectedIndex].value;
    $http.post('/api/rating/' + ratedId, $scope.rating).success(function (data) {
      console.log($scope.rating);
      console.log(ratedId);
      $scope.rating.Stars = 5;
      $scope.rating.Comments = '';
      alert("rating done!");
    });
  };

  var refresh = function(){
      $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
      $scope.project = res[0];
      $scope.memberList=[$scope.project.Admin];
      });

  };

  refresh();

  $scope.apply=function(){
    var Dup=false;
    var Done=false;
    /*You can only apply for a position if you are not a member or candidate of this project
    and the project is still in progress*/
    for(var i=0; i< $scope.project.Candidate.length;i++){
      if($scope.user._id === $scope.project.Candidate[i]._id){
        Dup=true;
        alert("You can't apply twice!");
      }
    }
    if($scope.project.Status===100){
      Done=true;
      alert("The project has already finished");
    }
    if(!Dup && !Done){
      $scope.project.Candidate.push($scope.user._id);
      console.log($scope.user._id);
      $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
        console.log("success");
      });
      refresh();
    }
  };
})



///////////////////////
//Project admin page///
///////////////////////
.controller('projectAdmin', function ($scope, $http, $routeParams,$location) {

  /*refresh*/
  var refresh = function(){
    /*check login status*/
  $http.get('auth/loggedin').success(function (user){
    if(user==='0'){
      $location.path('/login');
    }
    else{
        $http.get('/api/projects/' + $routeParams.projectID).success(function (res){
          $scope.project = res[0];
          if(user._id !== res[0].Admin._id){
            /*the user is not the admin*/
            $location.path('/');
          }
          if($scope.project.Status ===100){
            /*if the project is finished, admin can only delete it without any modification*/
            document.getElementById("updateprog").remove();
            $scope.project.Candidate=[];
            $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
              console.log("success");
            });

          }
        });
      }
    });
  };

  refresh();

  $scope.deleteMember=function(id){
    var i=0;
    console.log($scope.project.Member);
    for(var i = $scope.project.Member.length; i--;) {
          if($scope.project.Member[i]._id === id) {
              $scope.project.Member.splice(i, 1);
              console.log("delete!");
          }
    }
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
  };


  var deleteCandidate=function(id){
    var i=0;
    console.log(id);
    console.log($scope.project.Candidate);
    for(var i = $scope.project.Candidate.length; i--;) {
          if($scope.project.Candidate[i]._id === id) {
              $scope.project.Candidate.splice(i, 1);
              console.log("delete!");
          }
    }
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
  };

  /*accept the application of this candidate*/
  $scope.accept=function(id){
    $scope.project.Member.push(id);
    $http.put('/api/projects/'+$routeParams.projectID, $scope.project).success(function(res){
      console.log("success");
    });
    deleteCandidate(id);
    refresh();
  };

  /*reject the application of this candidate*/
  $scope.reject=function(id){
    deleteCandidate(id);
    refresh();
  };

  /*the admin can update the status of the project*/
  $scope.updateProg=function(){
    if($scope.prog>100 || $scope.prog <0){
        alert("not in proper range");
    }
    else{
      $scope.project.Status = $scope.prog;
      $http.put('/api/projects/'+ $routeParams.projectID, $scope.project).success(function(res){
        alert("success");
        refresh();
      });
    }
  };

  /*delete this project*/
  $scope.deleteProject=function(){
    $http.delete('/api/projects/'+$routeParams.projectID).success(function(res){
      alert("success");
      $location.path('/');
    });
  };

})


///////////////////////////////////
///////Create new project page/////
///////////////////////////////////
.controller('projectApply', function ($scope, $http, $routeParams,$location) {
  $http.get('auth/loggedin').success(function (user){
    /*check login status*/
    if(user=='0'){
      $location.path('/login');
    }
    else{
      $scope.user=user;
      /*create empty project object*/
      $scope.project={ProjectName:'',
      Description:'',
      Subjects:[],
      Start_time:'',
      Finish_time:'',
      Status:0,
      Admin:$scope.user._id,
      Member:[],
      Candidate:[],
      Comments:[]
    };
    }
  });

  /*create a new project with the information provided*/
  $scope.apply=function(){
    var newProject = $scope.project;
    newProject.Start_time= Date();
    var subjectList=[];
    var form=document.getElementById("subject");
    for(var i=0; i<form.elements.length; i++){
      if(form.elements[i].checked){
        subjectList.push(form.elements[i].value);
      }
    }
    newProject.Subjects=subjectList;
    if($scope.project.ProjectName===''){
      alert("You must fill in the project name!");
    }
    else{
    $http.post('/api/projects', newProject).success(function(response){
      alert("Create new project successfully!");
    }); 
    $location.path('/');  
    }
  };
});