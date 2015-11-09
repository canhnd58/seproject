angular.module('starter.controllers')
.controller('mutualProfileController', function($scope, $http, challengeService, facebook) {
  $scope.chart = {
    labels: ["Accuracy", "Speed", "Versatility", "Impressiveness", "Diligence"],
    colours: ['#97BBCD', '#F7464A'],
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

  // Get opp score and other information
  $http({
    method: 'GET',
    url: 'api/users/' + challengeService.getOpponentId()
  }).then(function successCallBack(response) {
    if (response.status === 200) {
      console.log('Opp profile data: ', response);
      $scope.opp = response.data;
      $scope.chart.data.push([$scope.opp.accuracy, $scope.opp.speed, $scope.opp.versatility,
                            $scope.opp.impressiveness, $scope.opp.diligence]);
      console.log("All chart data: ", $scope.chart.data);
    }
  }, function errorCallBack(response) {
    alert("Something went wrong!!!", response);
  });
})
