angular.module('starter.controllers')

.controller('challenge', function($scope, $controller,
  ngFB, globalService, userAPI, userInfo, gameInfo) {

  $scope.goBackView = function() {
    globalService.changeToBackState();
  };

  globalService.loadingScreenShow();
  ngFB.api({path: '/me/friends'})
    .then(function(response) {
      var userFBFriendsList = response.data;
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
      globalService.loadingScreenHide();
    })
    .catch(function(response) {
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Get friends list failed: " + response.statusText, response.status);
    });

  $scope.changeChallenge = function(item) {

    gameInfo.setIsChallenge(true);
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
        $ionicPopup.alert({
          title: "Sorry!",
          template: "You have already challenged " + item.name + "."
        });
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
    $state.go('mutualProfile');
  };

});
