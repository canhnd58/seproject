angular.module('starter.services')

.factory('challengeAPI', function($http, appConstants) {

  var url = appConstants.SERVER_URL;

  // POST api/challenges
  var _post = function(access_tokenVal, categoryVal, opponent_idVal) {
    return $http({
      method: 'POST',
      url: url + '/api/challenges',
      params: {
        access_token: access_tokenVal,
        category: categoryVal,
        opponent_id: opponent_idVal
      }
    });
  };

  // GET api/challenges
  var _get = function(access_tokenVal) {
    return $http({
      method: 'GET',
      url: url + '/api/challenges',
      params: {
        access_token: access_tokenVal
      }
    });
  };

  // GET api/challenge/:id
  var _get_id = function(idVal, access_tokenVal) {
    return $http({
      method: 'GET',
      url: url + '/api/challenge/' + idVal,
      params: {
        access_token: access_tokenVal
      }
    });
  };

  // Return functions
  return {
    post: _post,
    get: _get,
    getId: _get_id
  };

});
