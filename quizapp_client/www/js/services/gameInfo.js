angular.module('starter.services')

.factory('gameInfo', function() {
  var _isChallenge,
      _isChallenger,
      _categoryId,
      _challengeId,
      _oppId,
      _oppName,
      _matchId,
      _challengeStatus;

  var setIsChallenge = function setIsChallenge(boolVal) {
    _isChallenge = boolVal;
  };

  var setIsChallenger = function setIsChallenger(boolVal) {
    _isChallenger = boolVal;
  }

  var setCategoryId = function setCategoryId(idVal) {
    _categoryId = idVal;
  };

  var setChallengeId = function setChallengeId(idVal) {
    _challengeId = idVal;
  }

  var setOppId = function setOopId(idVal) {
    _oppId = idVal;
  };

  var setOppName = function setOopName(idVal) {
    _oppName = idVal;
  };

  var setMatchId = function setMatchId(idVal) {
    _matchId = idVal;
  };

  var setChallengeStatus = function setChallengeStatus(idVal) {
    _challengeStatus = idVal;
  };

  return {
    setIsChallenge: setIsChallenge,
    isChallenge: function() {
      return _isChallenge
    },
    setIsChallenger: setIsChallenger,
    isChallenger: function() {
      return _isChallenger
    },
    setCategoryId: setCategoryId,
    getCategoryId: function() {
      return _categoryId
    },
    setChallengeId: setChallengeId,
    getChallengeId: function() {
      return _challengeId
    },
    setOppId: setOppId,
    getOppId: function() {
      return _oppId
    },
    setOppName: setOppName,
    getOppName: function() {
      return _oppName
    },
    setMatchId: setMatchId,
    getMatchId: function() {
      return _matchId
    },
    setChallengeStatus: setChallengeStatus,
    getChallengeStatus: function() {
      return _challengeStatus
    }
  };

});
