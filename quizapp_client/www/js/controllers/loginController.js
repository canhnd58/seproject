angular.module('starter.controllers')
.controller('loginController', function($scope, $state, $ionicLoading, $http, ngFB, facebook) {
  // Login Facebook
  $scope.fbLogin = function() {
    ngFB.login({scope: 'user_friends'}).then(
      function(response) {
        console.log('Data facebook response: ', response);
        if (response.status === 'connected') {
          console.log('Facebook login in browser succeeded');
          // Get accessToken from facebook
          var accessToken = response.authResponse.accessToken;
          facebook.setToken(accessToken);

          // Loading screen to send data to server
          $scope.loadingIndicator = $ionicLoading.show({
        	    content: 'Sync data',
        	    animation: 'fade-in',
        	    showBackdrop: false,
        	    maxWidth: 200,
        	    showDelay: 500
        	});

          // Send accessToken to server
          $http({
            method: 'POST',
            url: '/api/user/session',
            data: {
              provider: 'facebook',
              access_token: accessToken
            }
          }).then(function successCallBack(response) {
            if (response.status === 200) {
              console.log("Server response: ", response);
              facebook.setUserId(response.data.id);
              facebook.setUserName(response.data.name);
              $ionicLoading.hide();
              $state.go('menu');
            }
          }, function errorCallBack(response) {
            $scope.loadingIndicator.hide();
            alert('Facebook login failed', response);
          });
        }
      }
    )
  }
});
