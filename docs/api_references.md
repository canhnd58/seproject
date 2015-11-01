# API Reference

## Overview

The QuizApp APIs are exposed using JSON over HTTP.

If the request is invalid or error happens, the server will send error code
through HTTP status code. If the multiple errors happen, the sever can send any
one of them. Below is the status code used:

* 400: Bad request
* 401: Unauthorized
* 403: Forbidden
* 404: Not found

## User

#### *POST api/users/session*

Login to web service. You must provide provider and access token. After
receiving the request, server will check if the access token is valid. If it is,
the server will send link to user in Location header of the response.

| Params | Required | Descriptions |
|--------|----------|--------------|
| provider | YES | Currently only support 'facebook' |
| access_token | YES | The access token got from Facebook |

**Possible errors**: 400, 401

#### *DELETE api/users/session*

Logout from app. After that, any request made with your given access token is
invalid.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | Your current access token |

**Possible errors**: 400, 401

#### *GET api/users/:id*

Retrieve informations about user with corresponding id. You can specify the
infos you want to get using 'fields' query parameter. If 'fields' parameters is
empty, then all the informations will be returned.

| Params | Required | Descriptions |
|--------|----------|--------------|
| fields | NO | List of information you want to get, separated by comma |

**Possible errors**: 400, 404

**Response's example**:

```
{
  "name" : "hgminh",
  "avatar" : "yurnero.jpg"
  "raing" : 6000,
  "highscore" : 100,
  "exp" : 50000,
  "accuracy" : 10.0,
  "speed" : 10.0,
  "versatility" : 10.0,
  "diligence" : 10.0,
  "impressiveness" : 10.0
}
```

#### *POST api/user/:id/friends*

Send list of facebook_id of friends to server.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's access token |
| friends | YES | List of facebook id of user's friends |

**Possible errors**: 400, 401, 404

#### *GET api/user/:id/friends*

Get list of friends of the specified user.

| Params | Required | Description |
| access_token | YES | User's current access token |

**Possible errors**: 400, 401, 404

**Response's example**:

```
{
  "friends" : [
    {
      "name" : "canhzz",
      "avatar" : "crystal_maiden.jpg",
      "win" : 1,
      "lose" : 0,
      "status" : "challenging" // TODO specify
      "challenge_id" : 123456
    },
    ...
  ]
}
```

#### *GET api/user/:user_id/friend/:friend_id*

Get the mutual information between user with user_id and user with friend_id.

**Possible errors**: 400, 404

**Response's example**:

```
{
  "win" : 10,
  "lose" : 3,
  "status" : 'challenge' // TODO
}
```

#### *PATCH api/user/:id*

Change user's information.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's current access token |
| name | NO | New name |
| avatar | NO | New avatar |

**Possible errors**: 400, 401, 403

## Match

#### *GET api/categories*

Return list of available categories.

No parameter required.

**Possible errors**: none

**Response's example**:

```
{
  "categories": [
    {
      "id" : 1,
      "name" : "math"
    },
    {
      "id" : 2,
      "name" : "history"
    },
    ...
  ]
}
```

#### *POST api/matches*

Create new match of the specified category. Return the match id as well as the
questions and answers of the match.

| Params | Required | Descriptions |
|--------|----------|--------------|
| category | YES | Category id of the category |
| access_token | YES | Your current access token |

**Possible errors**: 400, 401, 404

**Response's example**:

```
{
  "match_id" : 123456
  "questions" : [
    {
      "description" : "abc def ghiklmn?",
      "image_url" : "someurl.jpg",
      "kind" : 1,
      "score" : 10,
      "answers" : [
        {
          "id" : 1234,
          "value" : "pqrs",
          "is_correct" : true
        },
        {
          "id" : 1235,
          "value" : "wtxz",
          "is_correct" : false
        },
        ...
      ]
    },
    ...
  ]
}
```

#### *GET api/matches/:id*

Return the details information (list of questions and answers) of the match with
given id. A match can only be access by the user which it is dedicated to.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | Current access token of user |

**Possible errors**: 400, 401, 404

**Response's example**:

```
{
  "questions" : [
    {
      "description" : "abc def ghiklmn?",
      "image_url" : "someurl.jpg",
      "kind" : 1,
      "score" : 10,
      "answers" : [
        {
          "value" : "pqrs",
          "is_correct" : true
        },
        {
          "value" : "wtxz",
          "is_correct" : false
        },
        ...
      ]
    },
    ...
  ]
}
```

#### *GET api/match/:id/result*

Return result of the match with the specified id.

**Possible errors**: 404

**Response's example**:

```
{
  "score" : 123,
  "time" : 10.2,
  "questions" : [
    {
      "description" : "abc def?",
      "answer" : "ghi",
      "score" : 10,
      "is_correct" : true
    },
    ...
  ]
}
```

#### *PATCH api/match/:id*

Send the match's result to the server. The user has to send the match id as
well as the access token to server to authenticate.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | The current access token of user |
| match_id | YES | The match id of the match |
| score | YES | Total score of user |
| time | YES | Total time |
| streak | YES | Streak value |
| answers | YES | An array contains answer_id of selected answers of user |

**Possible errors**: 400, 401, 404

## Challenge

#### *POST api/challenges*

Create new challenge to another user. After challenge is created, 2 match will
be created. To get the questions or send result of match, use the api in the
match section.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's current access token. |
| category | YES | The category of the challenge. |
| opponent_id | YES | The id of the challenged user. |

**Possible errors**: 400, 401, 403, 404

**Response's example**:

```
{
  "challenge_id" : 1234412
  "your_match_id" : 123412
}
```

#### *GET api/challenges*

Return list of challenges to which the user is related.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's current access token |
| type | NO | The type of challenge, if the its value is 'challenger', list of challenges in which the user is challenger will be returned. If its value is 'challengee', list of challenges in which the user is challenged will be returned. |
| status | NO | The status of the returned challenges. It can be 'done', 'not done' or 'done but still new'. |
| limit | NO | The number of challenge returned. The limit cannot be exceeded than 100. By default, 10 challenges will be returned. |

**Possible errors**: 400, 401

**Response's example**:

```
{
  challenges_id: [ 12345, 678910, ...]
}
```

#### *GET api/challenge/:id*

Return details information of the challenge.

**Possible errors**: 400, 401

**Response's example**:

```
{
  "challenger_match_id" : 123,
  "challenger_score" : 10,
  "challengee_match_id" : 124,
  "challengee_score" : 20,
  "status" : "done"
}
```
