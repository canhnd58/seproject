angular.module('starter.controllers')

.controller('menu', function($scope, $state, $http, globalService, localStorage, ngFB, userInfo, gameInfo, userAPI) {

  // Single play game mode
  $scope.play = function() {
    gameInfo.setIsChallenge(false);
    gameInfo.setOppId(0);
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
    var confirmPopUp = globalService.confirmPopUp("Logout", "Are you sure to logout?", "No", "Yes");
    confirmPopUp.then(function(userChoice) {
      if (userChoice) {
        ngFB.logout();
        localStorage.removeObject('_userLocalData');
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
