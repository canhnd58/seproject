angular.module('starter.controllers')

.controller('challengeResultModal', function($scope, $state, $ionicModal, $http, globalService,
  challengeAPI, matchAPI, gameInfo, userInfo) {
  var userMatchId;
  var oppMatchId;

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
    $scope.modal.show();
  })
  .catch(function(response, status) {
    globalService.handleErrorResponse("Get challenge game info failed", status);
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
    if (gameInfo.getChallengeStatus() != 'not_viewed') $state.go('menu')
    else $state.reload();
  };

  // $ionicModal.fromTemplateUrl('templates/challengeResultModalView.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  //
  //   // Get matchId
  //   $http({
  //     method: 'GET',
  //     url: '/api/challenge/' + challengeService.getChallengeId(),
  //     params: {
  //       access_token: facebook.getToken()
  //     }
  //   }).then(function successCallBack(response) {
  //     console.log("Get api challenge: ", response);
  //     var userMatchId = response.data.challenger_match_id;
  //     var oppMatchId = response.data.challengee_match_id;
  //
  //     $http({
  //       method: 'GET',
  //       url: '/api/match/' + userMatchId + '/result'
  //     }).then(function successCallBack(response) {
  //       console.log("Get api challenge user: ", response.data);
  //       $scope.userResult = response.data;
  //     });
  //
  //     $http({
  //       method: 'GET',
  //       url: '/api/match/' + oppMatchId + '/result'
  //     }).then(function successCallBack(response) {
  //       console.log("Get api challenge opp: ", response.data);
  //       $scope.oppResult = response.data;
  //     });
  //   });
  //
  //   $scope.modal.show();
  // });

});
