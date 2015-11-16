angular.module('starter.services')

.factory('globalService', function($ionicLoading, $ionicPopup, $ionicHistory) {

  var _popUp = function(title, template) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });

    alertPopup.then(function(response) {
      $ionicHistory.goBack();
    });

  };

  var _handleErrorResponse = function(errorString, status) {
    console.log(errorString + " " + status);
    switch (status) {
      case 400:
        _popUp("Sorry", errorString + ".");
        break;

      case 401:
        _popUp("Sorry", errorString + ".");
        break;

      case 403:
        _popUp("Sorry", errorString + ".");
        break;

      case 404:
        _popUp("Sorry", errorString + ".");
        break;

      case 500:
        _popUp("Sorry", errorString + ".");
        break;

    }

  };

  var _showData = function(initString, data) {
    console.log(initString + ': ', data);
  };

  var _loadingScreenShow = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackDrop: true
    });
  };

  var _loadingScreenHide = function() {
    $ionicLoading.hide();
  };

  return {
    handleErrorResponse: _handleErrorResponse,
    showData: _showData,
    loadingScreenShow: _loadingScreenShow,
    loadingScreenHide: _loadingScreenHide,
    popUp: _popUp
  };

});
