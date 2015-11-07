angular.module('starter.controllers', []).constant('TIMER', 30000)

.controller('challengeController', function($scope, $state, $http, $ionicPopup, ngFB, facebook, categoryId, challengeService) {
  // Get user's friends list from Facebook
  ngFB.api({
    path: '/me/friends'
  }).then(function successCallBack(response) {
      $scope.userFBFriendsList = response.data;

      // Create friendsIdList to send to server
      $scope.friendsIdList = [];
      angular.forEach($scope.userFBFriendsList, function(value, key) {
        $scope.friendsIdList.push(value.id);
      });

      // Send user friends list to server
      $http({
        method: 'POST',
        url: '/api/user/' + facebook.getUserId() + '/friends',
        params: {
          access_token: facebook.getToken(),
          "friends[]": $scope.friendsIdList
        }
      }).then(function successCallBack(response) {
        // do nothing
      }, function errorCallBack(response) {
        alert("Something went wrong when send friends list to server! Status: ", response.status);
      });
    }
  );

  // Get user's friends list from server
  $http({
    method: 'GET',
    url: '/api/user/' + facebook.getUserId() + '/friends',
    params: {
      access_token: facebook.getToken()
    }
  }).then(function successCallBack(response) {
    console.log("Server friends list: ", response);
    $scope.userFriendsList = response.data.friends;
    angular.forEach($scope.userFriendsList, function(value, key) {
      var buttonStyle = "";
      var iconStyle = "";
      if (value.status === "normal") { // make a new challenge
        buttonStyle = "button button-positive ink";
        iconStyle = "icon ion-scissors";
      } else if (value.status === "challenged") { // being challenged
        buttonStyle = "button button-assertive ink";
        iconStyle = "icon ion-checkmark";
      } else if (value.status === "challenging") { // challenging opponent
        buttonStyle = "button button-stable ink";
        iconStyle = "icon ion-ios-pulse";
      } else if (value.status === "not_viewed") { // view results
        buttonStyle = "button button-balanced ink";
        iconStyle = "icon ion-ios-information-empty";
      }
      value.buttonStyle = buttonStyle;
      value.iconStyle = iconStyle;
    });
  }, function errorCallBack(response) {
    alert("Something went wrong when get friends list to server!");
  });

  // set isChallenge to make categories and questions display right
  challengeService.setChallenge();

  // Change challenge view
  $scope.changeChallenge = function(item) {
    if (item.status === "normal") {
      console.log(item.id);
      challengeService.setOpponentId(item.id);
      $state.go('categories');
    } else if (item.status === "challenged") {
      challengeService.setChallengeId(item.challenge_id);
      $state.go('questions');
    } else if (item.status === "challenging") {
      var alertPopup = $ionicPopup.alert({
        title: "Sorry!",
        template: "You have already challenged " + item.name + "."
      });
      alertPopup.then(function(response) {
        // do smt
      });
    } else if (item.status === "not_viewed") {

    }
  }
})

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
})

.controller('profileController', function($scope, $http, ngFB, facebook) {
  $scope.chart = {
    labels: ["Accuracy", "Speed", "Versatility", "Impressiveness", "Diligence"],
    options: {
      scaleOverride: true,
      scaleStartValue: 0,
      scaleStepWidth: 2,
      scaleSteps: 5,
      responsive: true,
      pointLabelFontSize : 12,
      pointDotRadius: 2
    }
  };
  // Get user score and other information
  $http({
    method: 'GET',
    url: 'api/users/' + facebook.getUserId()
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log('Profile data: ', response);
      $scope.user = response.data;
      $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                            $scope.user.impressiveness, $scope.user.diligence]];
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!", response);
  });
})

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
})

.controller('categoriesController', function($scope, $http, $state, categoryId, facebook, challengeService) {
  // Get Categories from server
  $http({
    method: 'GET',
    url: 'api/categories',
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log('Categories Success', response);
      $scope.categoriesData = response.data.categories;
    }
  }, function errorCallBack(response) {
    alert('Something went wrong!!!', response);
  });

  //
  $scope.takeQuiz = function(idValue) {
    categoryId.setId(idValue);
    // if challeng then send data to server
    if (challengeService.isChallenge()) {
      $http({
        method: 'POST',
        url: '/api/challenges',
        params: {
          access_token: facebook.getToken(),
          category: categoryId.getId(),
          opponent_id: challengeService.getOpponentId()
        }
      }).then(function successCallBack(response) {
        challengeService.setChallengeId(response.data.challenge_id);
        challengeService.setMatchId(response.data.your_match_id);
        console.log("POST/api/challenges success", response);
        $state.go('questions');
      }, function errorCallBack(response) {
        alert("Something went wrong!")
      })
    } else $state.go('questions');
  };

  //
  $scope.goProfile = function() {
    $state.go('profile');
  };
})

.controller('questionsController', function($scope, $http, $interval,$ionicModal, TIMER , categoryId, facebook, challengeService,
  ionicMaterialInk, ionicMaterialMotion) {
  // Get list of questions of user category choice
  if ((challengeService.isChallenge()) && (challengeService.getMatchId() == null)) {
    // Get matchId of the challenge
    $http({
      method: 'GET',
      url: '/api/challenge/' + challengeService.getChallengeId()
    }).then(function successCallBack(response) {
      console.log("Get /api/challenge response: ", response);
      challengeService.setMatchId(response.data.challengee_match_id);
      console.log("Match Id", challengeService.getMatchId());
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
      $scope.clientData = response.data.questions;
      $scope.clientSideList = response.data.questions[0];
    }, function errorCallBack(response) {
      alert("Something went wrong!!!", response);
    });
  }

  $scope.countdown = 30;
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

  $scope.getValue = function(index,value) {
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
    }
    if($scope.correct == false){
      $scope.streak += ($scope.streakCount * $scope.streakCount)
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
    if ($scope.cnt == $scope.clientData.length){
      $scope.finished = true;
      $interval.cancel(loop);
    }
    else $scope.clientSideList = $scope.clientData[$scope.cnt];
  }, 1000);
  };

   $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createContact = function(u) {        
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };

  // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  // Set Ink
    ionicMaterialInk.displayEffect();
});
