angular.module('starter.controllers')

.controller('challengeResultModal', function($scope, $ionicModal, $controller, $state,
  globalService, challengeAPI, matchAPI, gameInfo, userInfo) {
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
    if (gameInfo.getChallengeStatus() == 'not_viewed') {
      userMatchId = response.data.challenger_match_id;
      oppMatchId = response.data.challengee_match_id;
    } else if (gameInfo.getChallengeStatus() == 'challenged') {
      userMatchId = response.data.challengee_match_id;
      oppMatchId = response.data.challenger_match_id;
    };
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
  .then(function() {
    $scope.result = "YOU WIN";
    if ($scope.userResult.score < $scope.oppResult.score ||
      ($scope.userResult.score == $scope.oppResult.score && $scope.userResult.time > $scope.oppResult.time))
        $scope.result = "YOU LOSE";
  })
  .catch(function(response) {
    globalService.loadingScreenHide();
    globalService.handleErrorResponse("Get challenge game info failed: " + response.statusText, response.status);
  });

  $scope.goToStatChange = function() {
    $scope.modal.hide();
    if (gameInfo.getChallengeStatus() != 'not_viewed') {
      var goStatModal = $scope.$new();
      $controller('statChangeModal', {$scope: goStatModal});
    } else $state.reload();
  };

});
