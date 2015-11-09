angular.module('starter.controllers')
.controller('challengeResultModalController', function($scope, $state, $ionicModal, $http, facebook, challengeService) {
  $ionicModal.fromTemplateUrl('templates/challengeResultModalView.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;

    // Get matchId
    $http({
      method: 'GET',
      url: '/api/challenge/' + challengeService.getChallengeId(),
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      console.log("Get api challenge: ", response);
      var userMatchId = response.data.challenger_match_id;
      var oppMatchId = response.data.challengee_match_id;

      $http({
        method: 'GET',
        url: '/api/match/' + userMatchId + '/result'
      }).then(function successCallBack(response) {
        console.log("Get api challenge user: ", response.data);
        $scope.userResult = response.data;
      });

      $http({
        method: 'GET',
        url: '/api/match/' + oppMatchId + '/result'
      }).then(function successCallBack(response) {
        console.log("Get api challenge opp: ", response.data);
        $scope.oppResult = response.data;
      });
    });

    $scope.modal.show();
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
    $state.go('menu');
  };

});
