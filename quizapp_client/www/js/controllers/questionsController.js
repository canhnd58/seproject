angular.module('starter.controllers')
.controller('questionsController', function($scope, $state, $controller, $http, $interval, $ionicModal, TIMER, 
  categoryId, facebook, challengeService, ionicMaterialInk, ionicMaterialMotion) {
  // Get list of questions of user category choice
  if ((challengeService.isChallenge()) && (challengeService.getMatchId() == null)) {
    // Get matchId of the challenge
    $http({
      method: 'GET',
      url: '/api/challenge/' + challengeService.getChallengeId(),
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      console.log("Get /api/challenge response: ", response);
      challengeService.setMatchId(response.data.challengee_match_id);
      console.log("Match Id", challengeService.getMatchId());
      $scope.matchId = challengeService.getMatchId();
      $http({
        method: 'GET',
        url: '/api/matches/' + challengeService.getMatchId(),
        params: {
          access_token: facebook.getToken()
        }
      }).then(function successCallBack(response) {
        console.log("Get questions succeeded", response);
        $scope.clientData = response.data.questions;
        $scope.clientSideList = response.data.questions[0];
      }, function errorCallBack(response) {
        alert("Something went wrong!!!", response);
      });
      }, function errorCallBack(response) {
        // handle error
      });
  }

  if (challengeService.getMatchId() != null) {
    $scope.matchId = challengeService.getMatchId();
    $http({
      method: 'GET',
      url: '/api/matches/' + challengeService.getMatchId(),
      params: {
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      console.log("Get questions succeeded", response);
      $scope.clientData = response.data.questions;
      $scope.clientSideList = response.data.questions[0];
    }, function errorCallBack(response) {
      alert("Something went wrong!!!", response);
    });
  };

  // Get questions of the matchId
  if (!challengeService.isChallenge()) {
    $http({
      method: 'POST',
      url: '/api/matches',
      params: {
        category: categoryId.getId(),
        access_token: facebook.getToken()
      }
    }).then(function successCallBack(response) {
      console.log("Get questions succeeded", response);
      $scope.matchId = response.data.match_id;
      $scope.clientData = response.data.questions;
      $scope.clientSideList = response.data.questions[0];
    }, function errorCallBack(response) {
      alert("Something went wrong!!!", response);
    });
  }

  $scope.cnt = 0;
  $scope.score = 0;
  $scope.finished = false;
  $scope.reset = true;
  $scope.changeColor = false;
  $scope.questionsIndex = 0;
  $scope.questionsArray = [];
  $scope.nextQuestionBlur = false;
  $scope.streakCount = 0;
  $scope.streak = 0;
  $scope.questionsResult = "";
  $scope.totalTime = 0;
  $scope.answersArray = [];

  $scope.user = {
    choice: null
  };

  $scope.tried = TIMER;
  var increaseTried = function(){
    $scope.tried -= 100;
  };

  var loop = $interval(function(){
    increaseTried();
    if($scope.tried < 7000){
      $scope.changeColor = true;
    }
    if($scope.tried == 0){
      $scope.nextQuestion();
    }
  }, 100);
  $scope.matchIdfunction = function(){
    return $scope.matchId;
  }
  $scope.getValue = function(index,value,answersId) {
    $scope.answersArray[$scope.questionsIndex] = answersId;
    $scope.Submitted = true;
    $scope.activeBtn = index.currentTarget.id;
    if(value == true){
      $scope.correct = true;
      $scope.score += $scope.clientSideList.score;
    }
    else $scope.correct = false;
  };

  $scope.nextQuestion = function() {
    $scope.totalTime += TIMER - $scope.tried;
    $scope.tried = TIMER + 1000;
    $scope.nextQuestionBlur = true;
    if($scope.correct == true){
      $scope.streakCount++;
      if($scope.cnt + 1 == $scope.clientData.length){
        $scope.streak += ($scope.streakCount * $scope.streakCount);
      }
    }
    if($scope.correct == false){
      $scope.streak += ($scope.streakCount * $scope.streakCount);
      $scope.streakCount = 0;
    };
    switch ($scope.streakCount) {
      case 0: $scope.questionsResult = "WRONG"; break;
      case 1: $scope.questionsResult = "OK"; break;
      case 2: $scope.questionsResult = "GOOD"; break;
      case 3: $scope.questionsResult = "GREAT"; break;
      case 4: $scope.questionsResult = "EXCELLENT"; break;
      case 5: $scope.questionsResult = "AMAZING"; break;
      case 6: $scope.questionsResult = "EXPERT"; break;
      case 7: $scope.questionsResult = "GENIUS"; break;
      case 8: $scope.questionsResult = "UNSTOPPABLE"; break;
      case 9: $scope.questionsResult = "GODLIKE"; break;
      case 10: $scope.questionsResult = "BEYOND GODLIKE"; break;
    }
    setTimeout(function() {
    $scope.nextQuestionBlur = false;
    $scope.questionsArray[$scope.questionsIndex] = $scope.correct;
    $scope.Submitted = false;
    $scope.activeBtn = 5;
    $scope.cnt = $scope.cnt + 1;
    $scope.changeColor = false;
    $scope.questionsIndex++;
    if ($scope.cnt == $scope.clientData.length) {
      console.log("Is challenge: ", challengeService.isChallenge());
      console.log("Challenge status: ", challengeService.getChallengeStatus());
    };
    if ($scope.cnt == $scope.clientData.length && challengeService.isChallenge() && challengeService.getChallengeStatus() != "normal") {
      var modalController = $scope.$new();
      $controller('challengeResultModalController', {$scope: modalController});
    };
    if ($scope.cnt == $scope.clientData.length) {
      console.log($scope.answersArray);
      $scope.finished = true;
      $interval.cancel(loop);
      $http({
        method: 'PATCH',
        url: ' api/match/' + $scope.matchIdfunction(),
        data: {
          access_token : facebook.getToken(),
          score : $scope.score,
          time : $scope.totalTime,
          streak : $scope.streak,
          answers : $scope.answersArray
        }
      }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
    else $scope.clientSideList = $scope.clientData[$scope.cnt];
    }, 300);
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.retry = function() {
    $state.go('menu');
  }

  // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  // Set Ink
    ionicMaterialInk.displayEffect();
});
