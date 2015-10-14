angular.module('starter.services', [])

.factory('CategoryId', function() {
  var id = null;
  return {
    setId: function(idValue) {
      id = idValue;
    },
    getId: function() {
      return id;
    }
  };
});
