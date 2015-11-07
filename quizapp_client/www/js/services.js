angular.module('starter.services', [])

.factory('challengeService', function() {
  var _isChallenge = null;
  var _opponentId = null;
  var _challengeId = null;
  var _matchId = null;
  return {
    setChallenge: function() {
      _isChallenge = true;
    },
    setSingle: function() {
      _isChallenge = false;
    },
    isChallenge: function() {
      return _isChallenge;
    },
    setOpponentId: function(idValue) {
      _opponentId = idValue;
    },
    getOpponentId: function() {
      return _opponentId;
    },
    setChallengeId: function(idValue) {
      _challengeId = idValue;
    },
    getChallengeId: function() {
      return _challengeId;
    },
    setMatchId: function(idValue) {
      _matchId = idValue;
    },
    getMatchId: function() {
      return _matchId;
    }
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
