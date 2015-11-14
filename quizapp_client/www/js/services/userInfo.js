angular.module('starter.services')

.factory('userInfo', function() {
  var _accessToken,
      _userId,
      _userName;

  var setAccessToken = function(val) {
    _accessToken = val;
  };

  var setUserId = function(val) {
    _userId = val;
  };

  var setUserName = function(val) {
    _userName = val;
  };

  return {
    setAccessToken: setAccessToken,
    getAccessToken: function() {
      return _accessToken
    },
    setUserId: setUserId,
    getUserId: function() {
      return _userId
    },
    setUserName: setUserName,
    getUserName: function() {
      return _userName
    }
  };

});
