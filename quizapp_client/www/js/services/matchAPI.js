angular.module('starter.services')

.factory('matchAPI', function($http) {

  // GET api/categories
  var _get_categories = function() {
    return $http({
      method: 'GET',
      url: '/api/categories'
    });
  };

  // POST api/matches
  var _post_matches = function(categoryVal, access_tokenVal) {
    return $http({
      method: 'POST',
      url: '/api/matches',
      params: {
        category: categoryVal,
        access_token: access_tokenVal
      }
    });
  };

  // GET api/matches/:id
  var _get_matches_id = function(idVal, access_tokenVal) {
    return $http({
      method: 'GET',
      url: '/api/matches/' + idVal,
      params: {
        access_token: access_tokenVal
      }
    });
  };

  // GET api/matches/:id/result
  var _get_match_id_result = function(idVal) {
    return $http({
      method: 'GET',
      url: '/api/match/' + idVal + '/result',
    });
  };

  // PATCH api/match/:id
  var _patch_match_id = function(idVal, access_tokenVal, scoreVal, timeVal, streakVal, answersVal) {
    return $http({
      method: 'PATCH',
      url: '/api/match/' + idVal,
      params: {
        access_token: access_tokenVal,
        score: scoreVal,
        time: timeVal,
        streak: streakVal,
        "answers[]": answersVal
      }
    });
  };

  // Return functions
  return {
    getCategories: _get_categories,
    postMatches: _post_matches,
    getMatchesId: _get_matches_id,
    getMatchIdResult: _get_match_id_result,
    patchMatchId: _patch_match_id
  };

});
