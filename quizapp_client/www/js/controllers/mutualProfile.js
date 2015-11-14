angular.module('starter.controllers')

.controller('mutualProfile', function($scope, $http, appConstants, userAPI, userInfo, gameInfo) {

  $scope.chart = {
    labels: ["Accuracy", "Speed", "Versatility", "Impressiveness", "Diligence"],
    colours: [appConstants.BLUECOLOR, appConstants.REDCOLOR],
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

  userAPI.getId(userInfo.getUserId())
    .then(function(response) {
      $scope.user = response.data;
      $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                            $scope.user.impressiveness, $scope.user.diligence]];
    })
    .catch(function(response, status) {
      globalService.handleErrorResponse("Get user data game failed", status);
    });

  userAPI.getId(gameInfo.getOppId())
    .then(function(response) {
      $scope.opp = response.data;
      $scope.chart.data.push([$scope.opp.accuracy, $scope.opp.speed, $scope.opp.versatility,
                            $scope.opp.impressiveness, $scope.opp.diligence]);
    })
    .catch(function(response, status) {
      globalService.handleErrorResponse("Get opp data game failed", status);
    });

});
