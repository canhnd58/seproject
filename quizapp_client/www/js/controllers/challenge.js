angular.module('starter.controllers')

.controller('challenge', function($scope, $controller, $state, $http, $ionicPopup, $ionicModal,
  ngFB, globalService, userAPI, userInfo, gameInfo) {

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
    .catch(function(response, status) {
      globalService.handleErrorResponse("Post friends list failed", status);
    });

  userAPI.getIdFriends(userInfo.getUserId(), userInfo.getAccessToken())
    .then(function(response) {
      $scope.userFriendsList = response.data.friends;
    })
    .catch(function(response, status) {
      globalService.handleErrorResponse("Get friends list failed", status);
    });

  $scope.changeChallenge = function(item) {

    gameInfo.setIsChallenge(true);
    gameInfo.setOppName(item.name);
    gameInfo.setChallengeStatus(item.status);

    switch (item.status) {
      case "normal":
        gameInfo.setOppId(item.id);
        gameInfo.setIsChallenger(true);
        $state.go('categories');
        break;
      case "challenged":
        gameInfo.setChallengeId(item.challenge_id);
        gameInfo.setIsChallenger(false);
        $scope.oppName = item.name;
        $state.go('questions');
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
  // $scope.changeChallenge = function(item) {
  //   if (item.status === "normal") {
  //     console.log(item.id);
  //     challengeService.setOpponentId(item.id);
  //     challengeService.setChallengeStatus(item.status);
  //     $state.go('categories');
  //   } else if (item.status === "challenged") {
  //     challengeService.setChallengeId(item.challenge_id);
  //     $scope.oppName = item.name;
  //     $state.go('questions');
    // } else if (item.status === "challenging") {
    //   var alertPopup = $ionicPopup.alert({
    //     title: "Sorry!",
    //     template: "You have already challenged " + item.name + "."
    //   });
    //   alertPopup.then(function(response) {
    //     // do smt
    //   });
  //   } else if (item.status === "not_viewed") {
  //     $scope.oppName = item.name;
  //     challengeService.setChallengeId(item.challenge_id);
  //     var modalController = $scope.$new();
  //     $controller('challengeResultModalController', {$scope: modalController});
  //   }
  // };
  //
  // // View mutual information
  // $scope.viewMutualProfile = function(item) {
  //   challengeService.setOpponentId(item.id);
  //   $state.go('mutualProfile');
  // }

  // Get user's friends list from Facebook
  // ngFB.api({path: '/me/friends'})
  //   .then(function successCallBack(response) {
  //     var userFBFriendsList = response.data;
  //
  //     // Create friendsIdList to send to server
  //     $scope.friendsIdList = [];
  //     angular.forEach(userFBFriendsList, function(value, key) {
  //       $scope.friendsIdList.push(value.id);
  //     });
  //
  //     // Send user friends list to server
  //     $http({
  //       method: 'POST',
  //       url: '/api/user/' + facebook.getUserId() + '/friends',
  //       params: {
  //         access_token: facebook.getToken(),
  //         "friends[]": $scope.friendsIdList
  //       }
  //     }).then(function successCallBack(response) {
  //       // do nothing
  //     }, function errorCallBack(response) {
  //       alert("Something went wrong when send friends list to server! Status: ", response.status);
  //     });
  //   }
  // );

  // Get user's friends list from server
  // $http({
  //   method: 'GET',
  //   url: '/api/user/' + facebook.getUserId() + '/friends',
  //   params: {
  //     access_token: facebook.getToken()
  //   }
  // }).then(function successCallBack(response) {
  //   console.log("Server friends list: ", response);
  //   $scope.userFriendsList = response.data.friends;
  // }, function errorCallBack(response) {
  //   alert("Something went wrong when get friends list to server!");
  // });

  // set isChallenge to make categories and questions display right
  // challengeService.setChallenge();

  // Change challenge view
