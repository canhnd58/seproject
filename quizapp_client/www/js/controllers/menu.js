angular.module('starter.controllers')

.controller('menu', function($scope, $ionicHistory, globalService, localStorage, ngFB, userInfo, gameInfo, userAPI) {

  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();

  // Single play game mode
  $scope.play = function() {
    gameInfo.setIsChallenge(false);
    gameInfo.setOppId(0);
    globalService.changeState('categories');
  };

  // Challenge game mode
  $scope.challenge = function() {
    gameInfo.setIsChallenge(true);
    globalService.changeState('challenge');
  };

  // User's profile
  $scope.profile = function() {
    globalService.changeState('profile');
  };

  // Logout facebook
  $scope.logout = function() {
    var confirmPopUp = globalService.confirmPopUp("Logout", "Are you sure to logout?", "No", "Yes");
    confirmPopUp.then(function(userChoice) {
      if (userChoice) {
        ngFB.logout();
        userAPI.deleteSession(userInfo.getAccessToken())
          .then(function(response) {
            globalService.changeState('login');
          })
          .catch(function(response) {
            globalService.handleErrorResponse("Logout facebook failed: " + response.statusText, response.status);
          });
      };
    });
  };

});
