angular.module('starter.controllers', [])

.controller('challengeController', function($scope, ngFB) {
  // Get user's friends list
  ngFB.api({
    path: '/me/friends'
  }).then(function successCallBack(response) {
      console.log("Friend response: ", response);
      $scope.userFriendsList = response.data;
    }
  );
})

.controller('menuController', function($scope, $state, $http, ngFB, facebook) {
  $scope.play = function() {
    $state.go('categories');
  };

  $scope.challenge = function() {
    $state.go('challenge');
  };

  $scope.profile = function() {
    $state.go('profile');
  };

  // Logout facebook
  $scope.logout = function() {
    ngFB.logout();
    $http({
      method: 'DELETE',
      url: '/api/user/session',
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      if (response.status === 200) {
        console.log("Logout data: ", response);
        $state.go('login');
      }
    }, function errorCallBack(response) {
      alert("Something went wrong when Logout", response);
    });
  };
})

.controller('profileController', function($scope, $http, ngFB, facebook) {
  $scope.chart = {
    labels: ["Accuracy", "Speed", "Versatility", "Impressiveness", "Diligence"],
    options: {
      scaleOverride: true,
      scaleStartValue: 0,
      scaleStepWidth: 2,
      scaleSteps: 5,
      responsive: true,
      pointLabelFontSize : 12,
      pointDotRadius: 2
    }
  };
  // Get user score and other information
  $http({
    method: 'GET',
    url: 'api/users/' + facebook.getUserId()
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log('Profile data: ', response);
      $scope.user = response.data;
      $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                            $scope.user.impressiveness, $scope.user.diligence]];
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!", response);
  });
})

.controller('loginController', function($scope, $state, $http, ngFB, facebook) {
  // Login Facebook
  $scope.fbLogin = function() {
    ngFB.login({scope: 'user_friends'}).then(
      function(response) {
        console.log('Data facebook response: ', response);
        if (response.status === 'connected') {
          console.log('Facebook login in browser succeeded');
          // Get accessToken from facebook
          var accessToken = response.authResponse.accessToken;
          facebook.setToken(accessToken);
          // Send accessToken to server
          $http({
            method: 'POST',
            url: '/api/user/session',
            data: {
              provider: 'facebook',
              access_token: accessToken
            }
          }).then(function successCallBack(response) {
            if (response.status === 200) {
              console.log("Server response: ", response);
              facebook.setUserId(response.data.id);
              $state.go('menu');
            }
          }, function errorCallBack(response) {
            alert('Facebook login failed', response);
          });
        }
      }
    )
  }
})

.controller('categoriesController', function($scope, $http, $state, categoryId, facebook) {
  // Get Categories from server
  $http({
    method: 'GET',
    url: 'api/categories',
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log('Categories Success', response);
      $scope.categoriesData = response.data.categories;
    }
  }, function errorCallBack(response) {
    alert('Something went wrong!!!', response);
  });

  //
  $scope.takeQuiz = function(idValue) {
    categoryId.setId(idValue);
    $state.go('questions');
  };

  //
  $scope.goProfile = function() {
    $state.go('profile');
  };
})



.controller('questionsController', function($scope, $http,$interval, categoryId, facebook, ionicMaterialInk, ionicMaterialMotion) {
  // Get list of questions of user category choice
  $http({
    method: 'POST',
    url:'/api/matches',
    params: {
      category: categoryId.getId(),
      access_token: facebook.getToken()
    }
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log("Get questions succeeded", response);
      $scope.clientData = response.data.questions;
      $scope.clientSideList = response.data.questions[0];
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!", response);
  });

  $scope.countdown = 30;
  $scope.cnt = 0;
  $scope.score = 0;
  $scope.finished = false;
  $scope.reset = true;
  $scope.changeColor = false;

  $scope.user = {
    choice: null
  };

  $scope.tried = 3000;
  var increaseTried = function(){
    $scope.tried --;
  };


  var loop = $interval(function(){
    increaseTried();
    if($scope.tried < 700){
      $scope.changeColor = true;
    }
    if($scope.tried == 0){
      $scope.nextQuestion();
    }
  }, 1);

  $scope.getValue = function(index,value) {
    $scope.Submitted = true;
    $scope.activeBtn = index.currentTarget.id;
    if(value == true){
      $scope.correct = true;
      $scope.score += $scope.clientSideList.score;
    }
    else $scope.correct = false;

  }
  $scope.nextQuestion = function() {
    $scope.tried = 3000;
    $scope.Submitted = false;
    $scope.activeBtn = 5;
    $scope.cnt = $scope.cnt + 1;
    $scope.changeColor = false;
    if ($scope.cnt == $scope.clientData.length){
      $scope.finished = true;
      $interval.cancel(loop);
    } 
    else $scope.clientSideList = $scope.clientData[$scope.cnt];
  };
  // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  // Set Ink
    ionicMaterialInk.displayEffect();
});



