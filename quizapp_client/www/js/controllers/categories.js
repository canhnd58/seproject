angular.module('starter.controllers')

.controller('categories', function($scope, $http, $state, globalService, matchAPI, challengeAPI, userInfo, gameInfo) {

  $scope.goBackView = function() {
    globalService.changeToBackState();
  };

  globalService.loadingScreenShow();
  // Get Categories from server
  matchAPI.getCategories()
    .then(function(response) {
      $scope.categoriesData = response.data.categories;
      console.log(response);
      globalService.loadingScreenHide();
    })
    .catch(function(response) {
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Get categories failed: " + response.statusText, response.status);
    });

  $scope.takeQuiz = function(categoryId) {

    gameInfo.setCategoryId(categoryId);

    switch(gameInfo.isChallenge()) {

      // Challenge mode
      case true: {
        globalService.loadingScreenShow();
        challengeAPI.post(userInfo.getAccessToken(), gameInfo.getCategoryId(), gameInfo.getOppId())
          .then(function(response) {
            gameInfo.setChallengeId(response.data.challenge_id);
            gameInfo.setMatchId(response.data.your_match_id);
            globalService.loadingScreenHide();
            globalService.changeState('questions');
          })
          .catch(function(response) {
            globalService.loadingScreenHide();
            globalService.handleErrorResponse("Get categories failed: " + response.statusText, response.status);
          });

        break;
      }
      // Offline mode
      case false: {
        globalService.changeState('questions');
        break;
      }
    }
  };

});
