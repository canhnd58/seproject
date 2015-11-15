angular.module('starter.controllers')

.controller('login', function($scope, $state, globalService, ngFB, userInfo, userAPI) {

  $scope.fbLogin = function() {
    ngFB.login({scope: 'user_friends'})
      .then(function(response) {
        if (response.status === 'connected') {
          var accessToken = response.authResponse.accessToken;
          userInfo.setAccessToken(accessToken);
          globalService.loadingScreenShow();
          return userAPI.postSession("facebook", userInfo.getAccessToken());
        }
      })
      .then(function(response) {
        userInfo.setUserId(response.data.id);
        globalService.loadingScreenHide();
        $state.go('menu');
      })
      .catch(function(response) {
        globalService.loadingScreenHide();
        globalService.handleErrorResponse("Login Facebook failed: " + response.statusText, response.status);
      });
    };

});
