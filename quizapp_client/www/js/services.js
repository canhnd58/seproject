angular.module('starter.services', [])

.factory('categoryId', function() {
  var id = null;
  return {
    setId: function(idValue) {
      id = idValue;
    },
    getId: function() {
      return id;
    }
  };
})

.factory('facebookAccessToken', function() {
  var _accessToken = null;
  return {
    setToken: function(accessToken) {
      _accessToken = accessToken;
    },
    getToken: function() {
      return _accessToken;
    }
  }
});
