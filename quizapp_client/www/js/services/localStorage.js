angular.module('starter.services')

.factory('localStorage', ['$window', '$ionicHistory', function($window, $ionicHistory) {

  return {

    isHave: function(key) {
      return (JSON.parse($window.localStorage[key] || null) != null);
    },

    set: function(key, value) {
      $window.localStorage[key] = value;
    },

    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },

    remove: function(key) {
      return $window.localStorage.removeItem(key);
    },

    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },

    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || null);
    },

    removeObject: function(key) {
      return $window.localStorage.removeItem(key);
    },

    clearAllData: function() {
      $window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    }

  }

}]);
