angular.module('starter.controllers')

.controller('questions', function($scope, $controller, $timeout, $interval, $ionicModal, $ionicHistory, $q,
  globalService, localStorage, appConstants, userInfo, gameInfo,
  userAPI, challengeAPI, matchAPI,
  ionicMaterialInk, ionicMaterialMotion) {

  $scope.categoryName = gameInfo.getCategoryName();

  // Show questions and calculate result
  var streak = 0; // required
  $scope.score = 0; // required
  var totalTime = 0; // required
  var answersArray = []; // required
  var matchId = 0; // required

  var resultSound = new Audio();
  var cnt = 0;
  var streakCount = 0;
  $scope.correct = false;
  $scope.finished = false;
  $scope.changeColor = false;
  $scope.correctArray = [];
  $scope.questionsResult = "";
  $scope.tried = appConstants.TIMER + 2800;

  var questionsDataPromise = getQuestionsData();
  questionsDataPromise
    .then(function(response) {
      resendResult()
        .catch(function(response) {
          var increaseTried = function() {
            $scope.tried -= 50;
          };
          $scope.loop = $interval(function() {
            increaseTried();
            if ($scope.tried < 7000) {
              $scope.changeColor = true;
            }
            if ($scope.tried == 0) {
              $scope.nextQuestion();
            }
          }, 50);
        });
    });

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
    $scope.correctArray[cnt] = $scope.correct;
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

    resendResult();

  };

  $scope.goBackView = function() {
    var confirmPopUp = globalService.confirmPopUp("Back to menu",
      "Are you sure to go back to menu?<br>Your match will be saved (soon).", "No", "Yes");
    confirmPopUp.then(function(userChoice) {
      if (userChoice) {
        $interval.cancel($scope.loop);
        backupData();
        globalService.changeState('menu');
      };
    });
  };

  ionicMaterialMotion.fadeSlideInRight();
  ionicMaterialInk.displayEffect();

  // Functions
  // backupdata() save your answer in localStorage if you go back to menu
  var backupData = function() {
    localStorage.setObject(
      "_" + userInfo.getUserId() +
      "_" + gameInfo.isChallenge() +
      "_" + gameInfo.getOppId() +
      "_" + gameInfo.getCategoryId(), {
        cnt: cnt,
        streak: streak,
        streakCount: streakCount,
        score: $scope.score,
        totalTime: totalTime,
        answersArray: answersArray,
        correctArray: $scope.correctArray,
        questionsData: $scope.questionsData,
        singleQuestion: $scope.questionsData[cnt],
        tried: $scope.tried,
        matchId: gameInfo.getMatchId()
      });
  };
  // removeData() remove your old backupData() when you finish send result to server
  var removeData = function() {
    localStorage.removeObject(
      "_" + userInfo.getUserId() +
      "_" + gameInfo.isChallenge() +
      "_" + gameInfo.getOppId() +
      "_" + gameInfo.getCategoryId());
  };
  // resendResult() use when send result to server having trouble
  // data will be saved and will resend to server in the next time user play
  var resendResult = function() {
    var defer = $q.defer();

    if (cnt == $scope.questionsData.length) {
      $interval.cancel($scope.loop);
      $scope.finished = gameInfo.getChallengeStatus() != "challenged";
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
          removeData();
          defer.resolve("Send result to server success.");
          if (gameInfo.isChallenge() && gameInfo.getChallengeStatus() == "challenged") {
            var modalController = $scope.$new();
            $controller('challengeResultModal', {$scope: modalController});
          } else if (!gameInfo.isChallenge()) {
            var modalController = $scope.$new();
            $controller('singleResultModal', {$scope: modalController});
          };
        })
        .catch(function(response) {
          globalService.loadingScreenHide();
          backupData();
          defer.reject("Send result to server failed.");
          globalService.handleErrorResponse("Send match result failed: " + response.statusText, response.status);
        });
    } else defer.reject("Continue answering");

    return defer.promise;
  };

  // Get questions from local or server due to localStorage
  function getQuestionsData() {
    var defer = $q.defer();

    if (localStorage.getObject(
      '_' + userInfo.getUserId() +
      '_' + gameInfo.isChallenge() +
      '_' + gameInfo.getOppId() +
      '_' + gameInfo.getCategoryId()) != null) {
        var oldMatchData = localStorage.getObject(
          "_" + userInfo.getUserId() +
          "_" + gameInfo.isChallenge() +
          "_" + gameInfo.getOppId() +
          "_" + gameInfo.getCategoryId());

        cnt = oldMatchData.cnt;
        streak = oldMatchData.streak;
        streakCount = oldMatchData.streakCount;
        $scope.score = oldMatchData.score;
        totalTime = oldMatchData.totalTime;
        answersArray = oldMatchData.answersArray;
        $scope.correctArray = oldMatchData.correctArray;
        $scope.questionsData = oldMatchData.questionsData;
        $scope.singleQuestion = oldMatchData.questionsData[cnt];
        $scope.tried = oldMatchData.tried + 2800;
        matchId = oldMatchData.matchId;

        gameInfo.setMatchId(matchId);

        defer.resolve("Get old questions success");

    } else {
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
            defer.resolve("Get questions success");
          })
          .catch(function(response) {
            globalService.loadingScreenHide();
            defer.reject("Get questions failed");
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
            defer.resolve("Get questions success");
          })
          .catch(function(response) {
            globalService.loadingScreenHide();
            defer.reject("Get questions failed");
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
            defer.resolve("Get questions success");
          })
          .catch(function(response) {
            globalService.loadingScreenHide();
            defer.reject("Get questions failed");
            globalService.handleErrorResponse("Get questions for trainning failed: " + response.statusText, response.status);
          });
      };

    };

    return defer.promise;
  };

});
