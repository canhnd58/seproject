angular.module('starter.controllers')
.controller('challengeController', function($scope, $controller, $state, $http, $ionicPopup, $ionicModal,
  ngFB, facebook, categoryId, challengeService) {
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
      challengeService.setChallengeStatus(item.status);
      $state.go('categories');
    } else if (item.status === "challenged") {
      challengeService.setChallengeId(item.challenge_id);
      $scope.oppName = item.name;
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
      $scope.oppName = item.name;
      challengeService.setChallengeId(item.challenge_id);
      var modalController = $scope.$new();
      $controller('challengeResultModalController', {$scope: modalController});
    }
  };

  // View mutual information
  $scope.viewMutualProfile = function(item) {
    challengeService.setOpponentId(item.id);
    $state.go('mutualProfile');
  }
});
