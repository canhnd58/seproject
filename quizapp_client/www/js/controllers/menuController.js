angular.module('starter.controllers')
.controller('menuController', function($scope, $state, $http, ngFB, facebook, categoryId, challengeService) {
  $scope.play = function() {
    challengeService.setSingle();
    $state.go('categories');
  };

  $scope.challenge = function() {
    $state.go('challenge');
  };

  $scope.profile = function() {
    $state.go('profile');
  };

  // Logout facebook
  $scope.logout = function() {
    ngFB.logout();
    $http({
      method: 'DELETE',
      url: '/api/user/session',
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      if (response.status === 200) {
        console.log("Logout data: ", response);
        $state.go('login');
      }
    }, function errorCallBack(response) {
      alert("Something went wrong when Logout", response);
    });
  };
});
