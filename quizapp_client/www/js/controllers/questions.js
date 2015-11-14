angular.module('starter.controllers')

.controller('questions', function($scope, $state, $controller, $http, $timeout, $interval, $ionicModal,
  globalService, appConstants, userInfo, gameInfo, challengeAPI, matchAPI, ionicMaterialInk, ionicMaterialMotion) {

  // Get list of questions of user category choice

  // Case 1: isChallengee and isChallengee
  if (gameInfo.isChallenge() && !gameInfo.isChallenger()) {

    challengeAPI.getId(gameInfo.getChallengeId(), userInfo.getAccessToken())
      .then(function(response) {
        gameInfo.setMatchId(response.data.challengee_match_id);
        return matchAPI.getMatchesId(gameInfo.getMatchId(), userInfo.getAccessToken());
      })
      .then(function(response) {
        $scope.questionsData = response.data.questions;
        $scope.singleQuestion = response.data.questions[0];
      })
      .catch(function(response, status) {
        globalService.handleErrorResponse("Get questions challenge of challengee failed", status);
      });

  };

  // Case 2: isChallenge and isChallenger
  if (gameInfo.isChallenge() && gameInfo.isChallenger()) {
    matchAPI.getMatchesId(gameInfo.getMatchId(), userInfo.getAccessToken())
      .then(function(response) {
        $scope.questionsData = response.data.questions;
        $scope.singleQuestion = response.data.questions[0];
      })
      .catch(function(response, status) {
        globalService.handleErrorResponse("Get questions challenge of challenger failed", status);
      });
  };

  // Case 3: !isChallenge()
  if (!gameInfo.isChallenge()) {
    matchAPI.postMatches(gameInfo.getCategoryId(), userInfo.getAccessToken())
      .then(function(response) {
        gameInfo.setMatchId(response.data.match_id);
        $scope.questionsData = response.data.questions;
        $scope.singleQuestion = response.data.questions[0];
      })
      .catch(function(response, status) {
        globalService.handleErrorResponse("Get questions single player failed", status);
      });
  };

  // Show questions and calculate result
  var cnt = 0;
  $scope.score = 0;
  $scope.correct = false;
  $scope.finished = false;
  var totalTime = 0;
  var reset = true;
  var chageColor = false;
  $scope.questionsArray = [];
  var streakCount = 0;
  var streak = 0;
  $scope.questionsResult = "";
  var totalTime = 0;
  var answersArray = [];

  $scope.user = {
    choice: null
  };

  $scope.tried = appConstants.TIMER;
  var increaseTried = function() {
    $scope.tried -= 100;
  };

  var loop = $interval(function() {
    increaseTried();
    if ($scope.tried < 7000) {
      changeColor = true;
    }
    if ($scope.tried == 0) {
      $scope.nextQuestion();
    }
  }, 100);

  $scope.getValue = function(index, value, answersId) {
    answersArray[cnt] = answersId;
    $scope.submitted = true;
    $scope.activeBtn = index.currentTarget.id;
    if (value == true) {
      $scope.correct = true;
      $scope.score += $scope.singleQuestion.score;
    }
    else $scope.correct = false;
  };

  $scope.nextQuestion = function() {

    totalTime += appConstants.TIMER - $scope.tried;
    $scope.tried = appConstants.TIMER + 1000;
    $scope.nextQuestionBlur = true;

    if ($scope.correct == true) {
      streakCount++;
      if (cnt + 1 == $scope.questionsData.length) {
        streak += streakCount * streakCount;
      }
    } else if ($scope.correct == false) {
      streak += streakCount * streakCount;
      streakCount = 0;
    };

    $scope.questionsResult = appConstants.QUESTIONSRESULT[streakCount];

    $timeout(function() {
      $scope.nextQuestionBlur = false;
      $scope.questionsArray[cnt] = $scope.correct;
      $scope.submitted = false;
      $scope.activeBtn = 5;
      $scope.changeColor = false;
      cnt++;

      if (cnt == $scope.questionsData.length && gameInfo.isChallenge() && gameInfo.getChallengeStatus() != "normal") {
        var modalController = $scope.$new();
        $controller('challengeResultModal', {$scope: modalController});
      };

      if (cnt == $scope.questionsData.length) {
        $scope.finished = true && gameInfo.getChallengeStatus() != "challenged";
        $interval.cancel(loop);
        matchAPI.patchMatchId(gameInfo.getMatchId(), userInfo.getAccessToken(), $scope.score, totalTime, streak, answersArray);
      } else $scope.singleQuestion = $scope.questionsData[cnt];
    }, 300);
  };

  $ionicModal.fromTemplateUrl('templates/singleResultModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.retry = function() {
    $state.go('menu');
  };

  ionicMaterialMotion.fadeSlideInRight();
  ionicMaterialInk.displayEffect();

});
