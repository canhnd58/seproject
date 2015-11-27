angular.module('starter.controllers')

.controller('login', function($scope, $state, ngFB, globalService, localStorage, userInfo, userAPI) {
  // localStorage.clearAllData();
  if (localStorage.getObject('_userLocalData') != null) {
    var userLocalData = localStorage.getObject('_userLocalData');

    userInfo.setAccessToken(userLocalData.accessToken);
    userInfo.setUserId(userLocalData.id);

    globalService.turnOffAnimateForNextView();
    globalService.changeState('menu');
  };

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
        localStorage.setObject('_userLocalData', {
          accessToken: userInfo.getAccessToken(),
          id: userInfo.getUserId()
        });
        globalService.loadingScreenHide();
        globalService.changeState('menu');
      })
      .catch(function(response) {
        globalService.loadingScreenHide();
        globalService.handleErrorResponse("Login Facebook failed: " + response.statusText, response.status);
      });
    };

});
