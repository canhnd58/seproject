angular.module('starter.controllers')

.controller('challenge', function($scope, $controller, $ionicPopup,
  ngFB, globalService, localStorage, userAPI, userInfo, gameInfo) {

  $scope.goBackView = function() {
    globalService.changeToBackState();
  };

  $scope.userFBFriendsList = [];
  globalService.loadingScreenShow();
  ngFB.api({path: '/me/friends'})
    .then(function(response) {
      userFBFriendsList = response.data;
      $scope.friendsIdList = [];
      angular.forEach(userFBFriendsList, function(value, key) {
        $scope.friendsIdList.push(value.id);
      });
      return userAPI.postIdFriends(userInfo.getUserId(), userInfo.getAccessToken(), $scope.friendsIdList);
    })
    .then(function(response) {
      // Do nothing
    })
    .catch(function(response) {
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Post friends list failed: " + response.statusText, response.status);
    });

  userAPI.getIdFriends(userInfo.getUserId(), userInfo.getAccessToken())
    .then(function(response) {
      $scope.userFriendsList = response.data.friends;
      var keyString =
        '_' + userInfo.getUserId() +
        '_' + 'true' + '_';
      angular.forEach($scope.userFriendsList, function(value, key) {
        value.isHave = localStorage.isHave(keyString + value.id);
      });
      globalService.loadingScreenHide();
    })
    .catch(function(response) {
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Get friends list failed: " + response.statusText, response.status);
    });

  $scope.changeChallenge = function(item) {

    gameInfo.setIsChallenge(true);
    gameInfo.setOppId(item.id);
    gameInfo.setOppName(item.name);
    gameInfo.setChallengeStatus(item.status);

    switch (item.status) {
      case "normal":
        gameInfo.setOppId(item.id);
        gameInfo.setIsChallenger(true);
        globalService.changeState('categories');
        break;
      case "challenged":
        gameInfo.setChallengeId(item.challenge_id);
        gameInfo.setCategoryName("This name is not available! Waiting for update API.");
        gameInfo.setIsChallenger(false);
        $scope.oppName = item.name;
        globalService.changeState('questions');
        break;
      case "challenging":
        var keyString =
          '_' + userInfo.getUserId() +
          '_' + gameInfo.isChallenge() +
          '_' + gameInfo.getOppId();
        if (localStorage.isHave(keyString)) {
          globalService.confirmPopUp("Continue", "Do you want to continue your last state challenge with " + item.name + "?", "Later", "Yes")
            .then(function(userChoice) {
              if (userChoice) {
                globalService.changeState('questions');
              }
            });
        } else {
          $ionicPopup.alert({
            title: "Sorry!",
            template: "You have already challenged " + item.name + "."
          });
        };
        break;
      case "not_viewed":
        $scope.oppName = item.name;
        gameInfo.setChallengeId(item.challenge_id);
        var modalController = $scope.$new();
        $controller('challengeResultModal', {$scope: modalController});
        break;
    }
  };

  // View mutual information
  $scope.viewMutualProfile = function(item) {
    gameInfo.setOppId(item.id);
    globalService.changeState('mutualProfile');
  };

});
