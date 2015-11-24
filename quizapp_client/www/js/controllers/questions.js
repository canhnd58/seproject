angular.module('starter.controllers')

.controller('questions', function($scope, $controller, $timeout, $interval, $ionicModal, $ionicHistory,
  globalService, appConstants, userInfo, gameInfo, userAPI, challengeAPI, matchAPI, ionicMaterialInk, ionicMaterialMotion) {

  $scope.goBackView = function() {
    $interval.cancel(loop);
    globalService.changeState('menu');
  };

  // Get list of questions of user category choice
  globalService.loadingScreenShow();
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
        globalService.loadingScreenHide();
      })
      .catch(function(response) {
        globalService.loadingScreenHide();
        globalService.handleErrorResponse("Get questions for challengee failed: " + response.statusText, response.status);
      });

  };

  // Case 2: isChallenge and isChallenger
  if (gameInfo.isChallenge() && gameInfo.isChallenger()) {
    matchAPI.getMatchesId(gameInfo.getMatchId(), userInfo.getAccessToken())
      .then(function(response) {
        $scope.questionsData = response.data.questions;
        $scope.singleQuestion = response.data.questions[0];
        globalService.loadingScreenHide();
      })
      .catch(function(response) {
        globalService.loadingScreenHide();
        globalService.handleErrorResponse("Get questions for challenger failed: " + response.statusText, response.status);
      });
  };

  // Case 3: !isChallenge()
  if (!gameInfo.isChallenge()) {
    matchAPI.postMatches(gameInfo.getCategoryId(), userInfo.getAccessToken())
      .then(function(response) {
        gameInfo.setMatchId(response.data.match_id);
        $scope.questionsData = response.data.questions;
        $scope.singleQuestion = response.data.questions[0];
        globalService.loadingScreenHide();
      })
      .catch(function(response) {
        globalService.loadingScreenHide();
        globalService.handleErrorResponse("Get questions for trainning failed: " + response.statusText, response.status);
      });
  };

  // Show questions and calculate result
  var streak = 0; // required
  $scope.score = 0; // required
  var totalTime = 0; // required
  var answersArray = []; // required

  var resultSound = new Audio();
  var cnt = 0;
  var streakCount = 0;
  $scope.correct = false;
  $scope.finished = false;
  $scope.changeColor = false;
  $scope.questionsArray = [];
  $scope.questionsResult = "";


  $scope.tried = appConstants.TIMER + 3000;
  var increaseTried = function() {
    $scope.tried -= 50;
  };

  var loop = $interval(function() {
    increaseTried();
    if ($scope.tried < 7000) {
      $scope.changeColor = true;
    }
    if ($scope.tried == 0) {
      $scope.nextQuestion();
    }
  }, 50);

  $scope.getValue = function(index, value, answersId) {
    answersArray[cnt] = answersId;
    $scope.submitted = true;
    $scope.activeBtn = index.currentTarget.id;
    if (value == true) {
      $scope.correct = true;
    }
    else $scope.correct = false;
  };

  $scope.nextQuestion = function() {
    totalTime += appConstants.TIMER - $scope.tried;
    $scope.tried = appConstants.TIMER + 500;
    $scope.nextQuestionBlur = true;

    if ($scope.correct == true) {
      resultSound = new Audio('sound/correctanswer.mp3');
      // resultSound.play();
      streakCount++;
      $scope.score += $scope.singleQuestion.score;
      if (cnt + 1 == $scope.questionsData.length) {
        streak += streakCount * streakCount;
      }
    } else if ($scope.correct == false) {
      resultSound = new Audio('sound/wronganswer.mp3');
      // resultSound.play();
      streak += streakCount * streakCount;
      streakCount = 0;
    };

    $scope.questionsResult = appConstants.QUESTIONSRESULT[streakCount];
    $scope.questionsArray[cnt] = $scope.correct;
    cnt++;

    $timeout(function() {
      $scope.nextQuestionBlur = false;
      $scope.submitted = false;
      $scope.activeBtn = 5;
      $scope.changeColor = false;

      if (cnt < $scope.questionsData.length) {
        $scope.singleQuestion = $scope.questionsData[cnt];
      };

    }, 300);

    if (cnt == $scope.questionsData.length) {
      $interval.cancel(loop);
      $scope.finished = gameInfo.getChallengeStatus() != "challenged";
    };

    if (cnt == $scope.questionsData.length) {
      globalService.loadingScreenShow();
      userAPI.getId(userInfo.getUserId())
        .then(function(response) {
          $scope.oldStat = response.data;
          return matchAPI.patchMatchId(gameInfo.getMatchId(),
            userInfo.getAccessToken(), $scope.score, totalTime,
            streak, answersArray);
        })
        .then(function(response) {
          globalService.loadingScreenHide();
          if (gameInfo.isChallenge() && gameInfo.getChallengeStatus() == "challenged") {
            var modalController = $scope.$new();
            $controller('challengeResultModal', {$scope: modalController});
          } else if (!gameInfo.isChallenge()) {
            var modalController = $scope.$new();
            $controller('singleResultModal', {$scope: modalController});
          };
        })
        .catch(function(response) {
          globalService.handleErrorResponse("Send match result failed: " + response.statusText, response.status);
        });
    };

  };

  ionicMaterialMotion.fadeSlideInRight();
  ionicMaterialInk.displayEffect();

});
