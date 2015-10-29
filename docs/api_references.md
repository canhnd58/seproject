# API Reference

## Overview

The QuizApp APIs are exposed using JSON over HTTP.

The response's format is described below:

```
{
  "status" : <status code>,
  "data" : {
    // Data here
  }
}
```

In case the request is invalid or error occurs, the 'status' field will contain
error code and the 'data' field will be empty. List of error codes is given at
the bottom of the document.

## User

##### POST api/users/session

Login to web service. You must provide provider and access token. After
receiving the request, server will check if the access token is valid. If it is,
the server will send back the id of user.

| Params | Required | Descriptions |
|--------|----------|--------------|
| provider | YES | Currently only support 'facebook' |
| access_token | YES | The access token got from Facebook |

**Possible errors**: 301, 302

**Response's example**:

```
{
  "status" : 200,
  "data": {
    "id" : 123455
  }
}
```

##### DELETE api/users/session

Logout from app. After that, any request made with your given access token is
invalid.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | Your current access token |

**Possible errors**: 301, 302

**Response's example**:

```
{
  "status" : 200,
  "data": {
    "message" : "success"
  }
}
```

##### GET api/users/:id

Retrieve informations about user with corresponding id. You can specify the
infos you want to get using 'fields' query parameter. If 'fields' parameters is
empty, then all the informations will be returned.

| Params | Required | Descriptions |
|--------|----------|--------------|
| fields | NO | List of information you want to get, separated by comma |

**Possible errors**: 302, 401

**Response's example**:

```
{
  "status" : 200,
  "data": {
    "name" : "hgminh",
    "avatar" : "yunero.jpg"
    "raing" : 6000,
    "highscore" : 100,
    "exp" : 50000,
    "accuracy" : 10.0,
    "speed" : 10.0,
    "versatility" : 10.0,
    "diligence" : 10.0,
    "impressiveness" : 10.0
  }
}
```

## Match

##### GET api/categories

Return list of available categories.

No parameter required.

**Possible errors**: none

**Response's example**:

```
{
  "status" : 200,
  "data": [
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

##### POST api/match

Create new match of the specified category. Return the match id as well as the
questions and answers of the match.

| Params | Required | Descriptions |
|--------|----------|--------------|
| category | YES | Category id of the category |
| access_token | YES | Your current access token |

**Possible errors**: 301, 302, 401

**Response's example**:

```
{
  "status" : 200,
  "data": {
    "match_id" : 123456
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

##### GET api/match/:id

Return the details information (list of questions and answers) of the match with
given id. A match can only be access by the user which it is dedicated to.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | Current access token of user |

**Possible errors**: 301, 302, 401

**Response's example**:

```
{
  "status" : 200,
  "data" : {
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
}
```

##### PATCH api/match/:id

Send the match's result to the server. The user has to send the match id as
well as the access token to server to authenticate.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | The current access token of user |
| match_id | YES | The match id of the match |
| score | YES | Total score of user |
| time | YES | Total time |

**Possible errors**: 301, 302, 401

**Response's example**:

```
{
  "status" : 200,
  "data": {
    "message" : "success"
  }
}
```

## Challenge

##### POST api/challenges

Create new challenge to another user. After challenge is created, 2 match will
be created. To get the questions or send result of match, use the api in the
match section.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's current access token |
| category | YES | The category of the challenge |

**Possible errors**: 301, 302, 401, 402

**Response's example**:

```
{
  "status" : 200,
  "data" : {
    "your_match_id" : 123412
  }
}
```

##### GET api/challenges

Return list of challenges to which the user is related.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | User's current access token |
| type | NO | The type of challenge, if the its value is 'challenger', list of challenges in which the user is challenger will be returned. If its value is 'challenged', list of challenges in which the user is challenged will be returned. |
| status | NO | The status of the returned challenged. It can be 'done', 'not done' or 'done but still new'. |
| limit | NO | The number of challenge returned. The limit cannot be exceeded than 100. By default, 10 challenges will be returned. |

**Possible errors**: 301, 302

**Response's example**:

```
{
  "status" : 200,
  "data" : {
    challenges_id: [ 12345, 678910, ...]
  }
}
```

##### GET api/challenges/:id

Return details information of the challenge.

| Params | Required | Descriptions |
| access_token | YES | User's current access token |

**Possible errors**: 301, 302

**Response's example**:

```
{
  "status" : 200,
  "data" : {
    "challenger_match_id" : 123,
    "challenged_match_id" : 124
  }
}
```

## Status code

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 301 | Authentication error. This error will be raised if the access token is invalid. |
| 302 | Syntax error. This error will be raised if the request is not follow the current syntax. |
| 401 | Can not find record. This error will be raised if the requested resource is not exist. |
| 402 | The action can not be completed. This error will be raised if the action of user violates the game's rules. |
