angular.module('starter.controllers', [])

.controller('profileController', function($scope, $http, profileService) {
  profileService.getData.then(function(data) {
    $scope.user = data.data.data;
    $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                          $scope.user.diligence, $scope.user.impressiveness]];
  });

  $scope.chart = {
      labels: ["Accuracy", "Speed", "Versatility", "Diligence", "Impressiveness"],
      options: {
        scaleOverride: true,
        scaleStartValue: 0,
        scaleStepWidth: 2,
        scaleSteps: 5,
        responsive: true,
        pointLabelFontSize : 14,
        pointDotRadius: 2
      }
  };
})

.controller('loginController', function($scope, $state, $http, ngFB, facebookAccessToken) {
  $scope.fbLogin = function () {
    ngFB.login({scope: ''}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                var accessToken = response.authResponse.accessToken;
                facebookAccessToken.setToken(accessToken);
                $http({
                  method: 'POST',
                  url: '/api/users/session',
                  // url: 'http://se2015-quizapp.herokuapp.com/api/users/session',
                  data: {
                    provider: 'facebook',
                    access_token: accessToken
                  }
                })
                  .success(function(data, status) {
                    console.log('AccessToken sent successfully!', status, data);
                  })
                $state.go('categories');
            } else {
                alert('Facebook login failed');
            }
        })
  };
})

.controller('categoriesController', function($scope, $http, $state, categoryId, facebookAccessToken) {
  $http.get('/api/categories')
  // $http.get('http://se2015-quizapp.herokuapp.com/api/categories')
    .success(function(data) {
      console.log('Categories Success', data);
      $scope.categoriesData = data.data;
    })
    .error(function(data) {
      console.log('Something went wrong when get categories', data);
    });

  $scope.takeQuiz = function(idValue) {
    categoryId.setId(idValue);
    $state.go('questions');
  };

  $scope.goProfile = function() {
    $state.go('profile');
  }
})
<<<<<<< Updated upstream

.controller('questionsController', function($scope, $http, categoryId, facebookAccessToken) {
=======
.controller('questionsController', function($scope, $http, categoryId, facebookAccessToken,ionicMaterialInk, ionicMaterialMotion) {
>>>>>>> Stashed changes
  $http.get('/api/match', {params: {category: categoryId.getId(), access_token: facebookAccessToken.getToken()}})
  // $http.get('http://se2015-quizapp.herokuapp.com/api/match', {params: {category: categoryId.getId(), access_token: facebookAccessToken.getToken()}})
    .success(function(data) {
      console.log('Questions Success');
      $scope.cnt = 0;
      $scope.clientData = data.data;
      $scope.clientSideList = $scope.clientData[0];
    })
    .error(function(data) {
      console.log('Something went wrong');
    });

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

