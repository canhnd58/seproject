angular.module('starter.controllers', [])
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
                  data: {
                    provider: 'facebook',
                    access_token: accessToken
                  }
                })
                  .success(function(data, status) {
                    console.log('AccessToken sent successfully!', status);
                  })
                  .error(function(data, status) {
                    console.log('AccessToken sent error!', status);
                  });
                $state.go('categories');
            } else {
                alert('Facebook login failed');
            }
        })
  };
})

.controller('categoriesController', function($scope, $http, $state, categoryId, facebookAccessToken) {
  $http.get('/api/categories')
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
})
.controller('questionsController', function($scope, $http, categoryId, facebookAccessToken) {
  $http.get('/api/match', {params: {category: categoryId.getId(), access_token: facebookAccessToken.getToken()}})
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

  $scope.user = {
    choice: null
  };

   $scope.getValue = function(index,value) {
    $scope.Submitted = true;
    $scope.activeBtn = index;
    if(value == true){
      $scope.correct = true;
      $scope.score += $scope.clientSideList.score;
    }
    else $scope.correct = false;
    if ($scope.cnt + 1 == $scope.clientData.length) $scope.finished = true;
  }
  $scope.nextQuestion = function() {
    $scope.Submitted = false;
    $scope.activeBtn = 5;
    $scope.cnt = $scope.cnt + 1;
    $scope.clientSideList = $scope.clientData[$scope.cnt];
  };
});
