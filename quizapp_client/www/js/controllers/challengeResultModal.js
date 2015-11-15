angular.module('starter.controllers')

.controller('challengeResultModal', function($scope, $state, $ionicModal, $http, globalService,
  challengeAPI, matchAPI, gameInfo, userInfo) {
  var userMatchId;
  var oppMatchId;

  globalService.loadingScreenShow();

  $scope.oppName = gameInfo.getOppName();

  $ionicModal.fromTemplateUrl('templates/challengeResultModalView.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then(function(modal) {
    $scope.modal = modal;
    return challengeAPI.getId(gameInfo.getChallengeId(), userInfo.getAccessToken());
  })
  .then(function(response) {
    userMatchId = response.data.challenger_match_id;
    oppMatchId = response.data.challengee_match_id;
    return matchAPI.getMatchIdResult(userMatchId);
  }).then(function(response) {
    $scope.userResult = response.data;
    return matchAPI.getMatchIdResult(oppMatchId);
  })
  .then(function(response) {
    $scope.oppResult = response.data;
    globalService.loadingScreenHide();
    $scope.modal.show();
  })
  .catch(function(response) {
    globalService.loadingScreenHide();
    globalService.handleErrorResponse("Get challenge game info failed: " + response.statusText, response.status);
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
    if (gameInfo.getChallengeStatus() != 'not_viewed') $state.go('menu')
    else $state.reload();
  };

});
