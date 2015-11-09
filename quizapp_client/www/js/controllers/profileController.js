angular.module('starter.controllers')
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
});
