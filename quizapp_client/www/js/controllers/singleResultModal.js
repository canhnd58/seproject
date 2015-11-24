angular.module('starter.controllers')

.controller('singleResultModal', function($scope, $ionicModal, $timeout, $controller, globalService) {

  $ionicModal.fromTemplateUrl('templates/singleResultModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();

    $scope.goToStatChange = function() {
      $scope.modal.hide();
      var goStatModal = $scope.$new();
      $controller('statChangeModal', {$scope: goStatModal});
    };

  });

})
