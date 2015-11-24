angular.module('starter.controllers')

.controller('statChangeModal', function($scope, $ionicModal, $timeout, userAPI, userInfo, globalService) {

  $ionicModal.fromTemplateUrl('templates/statChangeModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    return userAPI.getId(userInfo.getUserId());
  }).then(function(response) {
    $scope.newStat = response.data;
    $scope.modal.show();

    $scope.closeModal = function() {
      $scope.modal.hide();
      $timeout(function() {
        globalService.changeState('menu');
      }, 400);
    };

  });

})
