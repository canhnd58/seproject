angular.module('starter.services')

.factory('userAPI', function($http) {

  // Params: paramName(YES) -> paramName is required

  // POST api/user/session
  // Login to web service. You must provide provider and access token.
  // After receiving the request, server will check if the access token is valid.
  // If it is, the server will send link to user in Location header of the response.
  // Params:
  //    provider(YES): Currently only support 'facebook',
  //    access_token(YES): The access token got from Facebook
  // Possible errors: 400, 401
  var _post_session = function(providerVal, access_tokenVal) {
    return $http({
      method: 'POST',
      url: '/api/user/session',
      params: {
        provider: providerVal,
        access_token: access_tokenVal
      }
    });
  };

  // DELETE api/user/session
  // Logout from app.
  // After that, any request made with your given access token is invalid.
  // Params:
  //    access_token(YES): The access token got from Facebook
  // Possible errors: 400, 401
  var _delete_session = function(access_tokenVal) {
    return $http({
      method: 'DELETE',
      url: '/api/user/session',
      params: {
        access_token: access_tokenVal
      }
    });
  };

  // GET api/users/:id
  // Retrieve informations about user with corresponding id.
  // You can specify the infos you want to get using 'fields' query parameter.
  // If 'fields' parameters is empty, then all the informations will be returned.
  // Params:
  //    fields(NO): List of information you want to get, separated by comma
  // Possible errors: 400, 404
  var _get_id = function(idVal) {
    return $http({
      method: 'GET',
      url: '/api/users/' + idVal
    });
  };

  var _post_id_friends = function(idVal, access_tokenVal, friendsVal) {
    return $http({
      method: 'POST',
      url: '/api/user/' + idVal + '/friends',
      params: {
        access_token: access_tokenVal,
        "friends[]": friendsVal
      }
    });
  };

  var _get_id_friends = function(idVal, access_tokenVal) {
    return $http({
      method: 'GET',
      url: '/api/user/' + idVal + '/friends',
      params: {
        access_token: access_tokenVal,
      }
    });
  };

  // GET api/user/:user_id/friend/:friend_id
  var _get_id_friend_friendId = function(idVal, friend_idVal) {
    return $http({
      method: 'GET',
      url: '/api/users/' + idVal + '/friend/' + friend_idVal
    });
  };

  // TODO PATCH api/user/:id

  var _patch_id = function(idVal, access_tokenVal) {
    return $http({
      method: 'PATCH',
      url: '/api/user/' + idVal,
      params: {
        access_token: access_tokenVal
      }
    });
  };

  // Return functions
  return {
    postSession: _post_session,
    deleteSession: _delete_session,
    getId: _get_id,
    postIdFriends: _post_id_friends,
    getIdFriends: _get_id_friends,
    getMutualInfo: _get_id_friend_friendId,
    patchId: _patch_id
  };

});
