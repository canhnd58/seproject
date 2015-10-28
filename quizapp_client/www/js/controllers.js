angular.module('starter.controllers', [])

.controller('menuController', function($scope, $state, $http, ngFB, facebook) {
  $scope.play = function() {
    $state.go('categories');
  };
  $scope.profile = function() {
    $state.go('profile');
  };

  // Logout facebook
  $scope.logout = function() {
    ngFB.logout();
    $http({
      method: 'DELETE',
      url: '/api/users/session',
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      if (response.data.status === 200) {
        console.log("Logout data: ", response.data);
        $state.go('login');
      } else {
        alert('Something went wrong!!!\nError: ' + response.data.status);
        // do smt
      }
    }, function errorCallBack(response) {
      alert("Something went wrong when Logout");
    });
  };
})

.controller('profileController', function($scope, $http, facebook) {
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
    if (response.data.status === 200) {
      console.log('Profile data: ', response.data.data);
      $scope.user = response.data.data;
      $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                            $scope.user.impressiveness, $scope.user.diligence]];
    } else {
      alert('Something went wrong!!!\nError: ' + response.data.status);
      // do smt
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!");
  });
})

.controller('loginController', function($scope, $state, $http, ngFB, facebook) {
  // ngLoginfb
  $scope.fbLogin = function() {
    ngFB.login({scope: ''}).then(
      function(response) {
        if (response.status === 'connected') {
          console.log('Facebook login in browser succeeded');
          // Get accessToken from facebook
          var accessToken = response.authResponse.accessToken;
          facebook.setToken(accessToken);
          // Send accessToken to server
          $http({
            method: 'POST',
            url: '/api/users/session',
            data: {
              provider: 'facebook',
              access_token: accessToken
            }
          }).then(function successCallBack(response) {
            if (response.data.status === 200) {
              facebook.setUserId(response.data.data.id);
              $state.go('menu');
            } else {
              alert('Something went wrong!!!\nError: ' + response.data.status);
              // do smt
            }
          }, function errorCallBack(response) {
            alert('Facebook login failed');
          });
        }
      }
    )
  }
})

.controller('categoriesController', function($scope, $http, $state, categoryId, facebook, ionicMaterialInk, ionicMaterialMotion) {
  // Get Categories from server
  $http({
    method: 'GET',
    url: 'api/categories',
  }).then(function successCallBack(response) {
    if (response.data.status === 200) {
      console.log('Categories Success', response.data);
      $scope.categoriesData = response.data.data;
    } else {
      alert('Something went wrong!!!\nError: ' + response.data.status);
      // do smt
    }
  }, function errorCallBack(response) {
    alert('Something went wrong!!!');
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
  // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('questionsController', function($scope, $http, categoryId, facebook, ionicMaterialInk, ionicMaterialMotion) {
  // Get list of questions of user category choice
  $http({
    method: 'GET',
    url:'/api/match',
    params: {
      category: categoryId.getId(),
      access_token: facebook.getToken()
    }
  }).then(function successCallBack(response) {
    if (response.data.status === 200) {
      console.log("Get questions succeeded", response.data);
      $scope.clientData = response.data.data.questions;
      $scope.clientSideList = response.data.data.questions[0];
    } else {
      alert('Something went wrong!!!\nError: ' + response.data.status);
      // do smt
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!");
  });

  $scope.cnt = 0;
  $scope.score = 0;
  $scope.finished = false;
  $scope.timeOut = false;
  $scope.reset = true;

  $scope.user = {
    choice: null
  };

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
    $scope.Submitted = false;
    $scope.activeBtn = 5;
    $scope.cnt = $scope.cnt + 1;
    if ($scope.cnt == $scope.clientData.length) $scope.finished = true;
    else $scope.clientSideList = $scope.clientData[$scope.cnt];
  };
  // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  // Set Ink
    ionicMaterialInk.displayEffect();
});
