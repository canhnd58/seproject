angular.module('starter.controllers')

.controller('profile', function($scope, $http, globalService, ngFB, userInfo, userAPI) {

  $scope.goBackView = function() {
    globalService.changeToBackState();
  };

  globalService.loadingScreenShow();
  // Creating init chart
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
  userAPI.getId(userInfo.getUserId())
    .then(function successCallBack(response) {
      $scope.user = response.data;
      $scope.chart.data = [[$scope.user.accuracy, $scope.user.speed, $scope.user.versatility,
                            $scope.user.impressiveness, $scope.user.diligence]];
      globalService.loadingScreenHide();
    })
    .catch(function(response) {
      console.log(response.data);
      globalService.loadingScreenHide();
      globalService.handleErrorResponse("Get user's profile failed: " + response.statusText, response.status);
    });

});
