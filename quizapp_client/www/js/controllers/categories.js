angular.module('starter.controllers')

.controller('categories', function($scope, $http, $state, globalService, matchAPI, challengeAPI, userInfo, gameInfo) {

  // Get Categories from server
  matchAPI.getCategories()
    .then(function(response) {
      $scope.categoriesData = response.data.categories;
    })
    .catch(function(response, status) {
      globalService.handleErrorResponse("Get categories failed", status);
    });

  // $http({
  //   method: 'GET',
  //   url: 'api/categories',
  // }).then(function successCallBack(response) {
  //   if (response.status === 200) {
  //     console.log('Categories Success', response);
  //     $scope.categoriesData = response.data.categories;
  //   }
  // }, function errorCallBack(response) {
  //   alert('Something went wrong!!!', response);
  // });

  //
  $scope.takeQuiz = function(categoryId) {

    gameInfo.setCategoryId(categoryId);

    switch(gameInfo.isChallenge()) {
      // Challenge mode
      case true: {
        challengeAPI.post(userInfo.getAccessToken(), gameInfo.getCategoryId(), gameInfo.getOppId())
          .then(function(response) {
            gameInfo.setChallengeId(response.data.challenge_id);
            gameInfo.setMatchId(response.data.your_match_id);
            $state.go('questions');
          })
          .catch(function(response, status) {
            globalService.handleErrorResponse("Get categories failed", status);
          });

        break;
      }
      // Offline mode
      case false: {
        $state.go('questions');
        break;
      }
    }
  };

  //   if (challengeService.isChallenge()) {
  //     $http({
  //       method: 'POST',
  //       url: '/api/challenges',
  //       params: {
  //         access_token: facebook.getToken(),
  //         category: categoryId.getId(),
  //         opponent_id: challengeService.getOpponentId()
  //       }
  //     }).then(function successCallBack(response) {
  //       challengeService.setChallengeId(response.data.challenge_id);
  //       challengeService.setMatchId(response.data.your_match_id);
  //       console.log("POST/api/challenges success", response);
  //       $state.go('questions');
  //     }, function errorCallBack(response) {
  //       alert("Something went wrong!")
  //     })
  //   } else $state.go('questions');
  // };

});
