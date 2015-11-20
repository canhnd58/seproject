angular.module('starter.controllers')

.controller('mutualProfile', function($scope, $http, appConstants, globalService, userAPI, userInfo, gameInfo) {

  globalService.loadingScreenShow();

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
      return userAPI.getId(gameInfo.getOppId());
    })
    .then(function(response) {
      $scope.opp = response.data;
      $scope.chart.data.push([$scope.opp.accuracy, $scope.opp.speed, $scope.opp.versatility,
                            $scope.opp.impressiveness, $scope.opp.diligence]);
      globalService.loadingScreenHide();
    })
    .catch(function(response) {
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Get user data game failed: " + response.statusText, response.status);
    });

});
