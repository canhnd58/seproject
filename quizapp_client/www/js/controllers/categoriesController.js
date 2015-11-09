angular.module('starter.controllers')
.controller('categoriesController', function($scope, $http, $state, categoryId, facebook, challengeService) {
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
    // if challeng then send data to server
    if (challengeService.isChallenge()) {
      $http({
        method: 'POST',
        url: '/api/challenges',
        params: {
          access_token: facebook.getToken(),
          category: categoryId.getId(),
          opponent_id: challengeService.getOpponentId()
        }
      }).then(function successCallBack(response) {
        challengeService.setChallengeId(response.data.challenge_id);
        challengeService.setMatchId(response.data.your_match_id);
        console.log("POST/api/challenges success", response);
        $state.go('questions');
      }, function errorCallBack(response) {
        alert("Something went wrong!")
      })
    } else $state.go('questions');
  };

  //
  $scope.goProfile = function() {
    $state.go('profile');
  };
});
