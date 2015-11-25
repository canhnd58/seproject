angular.module('starter.services')

.factory('globalService', function($ionicLoading, $ionicPopup, $ionicHistory, $state) {

  var _popUp = function(title, template) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });

    alertPopup.then(function(response) {
      $ionicHistory.clearCache()
        .then(function() {
          $ionicHistory.goBack();
        });
    });

  };

  var _confirmPopUp = function(title, template, cancelText, okText) {
    var confirmPopUp = $ionicPopup.confirm({
      title: title,
      template: template,
      cancelText: cancelText,
      okText: okText
    });
    return confirmPopUp;
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

  var _changeState = function(stateValue) {
    $ionicHistory.clearCache()
      .then(function() {
        $state.go(stateValue);
      });
  };

  var _changeToBackState = function(stateValue) {
    $ionicHistory.goBack();
  };

  var _turnOffAnimateForNextView = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true
    });
  };

  return {
    handleErrorResponse: _handleErrorResponse,
    showData: _showData,
    loadingScreenShow: _loadingScreenShow,
    loadingScreenHide: _loadingScreenHide,
    popUp: _popUp,
    confirmPopUp: _confirmPopUp,
    changeState: _changeState,
    changeToBackState: _changeToBackState,
    turnOffAnimateForNextView: _turnOffAnimateForNextView
  };

});
