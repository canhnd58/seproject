angular.module('starter.controllers')

.controller('menu', function($scope, $state, $http, globalService, ngFB, userInfo, gameInfo, userAPI) {

  // Single play game mode
  $scope.play = function() {
    gameInfo.setIsChallenge(false);
    $state.go('categories');
  };

  // Challenge game mode
  $scope.challenge = function() {
    gameInfo.setIsChallenge(true);
    $state.go('challenge');
  };

  // User's profile
  $scope.profile = function() {
    $state.go('profile');
  };

  // Logout facebook
  $scope.logout = function() {
    ngFB.logout();
    userAPI.deleteSession(userInfo.getAccessToken())
      .then(function(response) {
        $state.go('login');
      })
      .catch(function(response) {
        globalService.handleErrorResponse("Logout facebook failed: " + response.statusText, response.status);
      });
  };

});
