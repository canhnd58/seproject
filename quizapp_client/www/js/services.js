angular.module('starter.services', [])

.factory('categoryId', function() {
  var id;
  return {
    setId: function(idValue) {
      id = idValue;
    },
    getId: function() {
      return id;
    }
  };
})

.factory('facebook', function() {
  var _accessToken;
  var _userId;
  return {
    setToken: function(accessToken) {
      _accessToken = accessToken;
    },
    setUserId: function(userId) {
      _userId = userId;
    },
    getToken: function() {
      return _accessToken;
    },
    getUserId: function() {
      return _userId;
    }
  }
});
