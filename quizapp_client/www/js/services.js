angular.module('starter.services', [])

.factory('profileService', function($http, facebookAccessToken) {
  var getDataPromise =
    $http.get('/api/users/' + facebookAccessToken.getUserId())
      .then(function(data) {
        return data;
      });
  return {
    getData: getDataPromise
  };
})

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

.factory('facebookAccessToken', function() {
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
