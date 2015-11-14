angular.module('starter.services')

.factory('globalService', function() {

  var _handleErrorResponse = function(errorString, status) {
    console.log(errorString + '.');
    switch (status) {
      case 400: {
        break;
      }
      case 401: {
        break;
      }
      case 404: {
        break;
      }
    }
  };

  var _showData = function(initString, data) {
    console.log(initString + ': ', data);
  };


  return {
    handleErrorResponse: _handleErrorResponse,
    showData: _showData
  }

});
