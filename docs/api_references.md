# API Reference

## Overview

The QuizApp APIs are exposed using JSON over HTTP.

Respond's format is described below:

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
the server will send back success message.

| Params | Required | Descriptions |
|--------|----------|--------------|
| provider | YES | Currently only support 'facebook' |
| access_token | YES | The access token got from Facebook |

**Possible errors**: 301, 302

**Respond's example**:

```
{
  "status" : 200,
  "data": {
    "message" : "success"
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

**Respond's example**:

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
empty, then the

| Params | Required | Descriptions |
|--------|----------|--------------|
| fields | NO | List of information you want to get, separated by comma |

**Possible errors**: 302, 401

**Respond's example**:

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

Return list of categories.

No parameter required.

**Possible errors**: none

**Respond's example**:

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

Return list of questions and answers of them. You must provide access token and
category id. After this action, new match will be created in the database. The
match id will be return to the user.

| Params | Required | Descriptions |
|--------|----------|--------------|
| category | YES | Category id of the category |
| access_token | YES | Your current access token |

**Possible errors**: 301, 302, 401

**Respond's example**:

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
        "answer" : [
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

##### POST api/match

Send the match's result to the server. The user has to send the match id as 
well as the access token to server to authenticate.

| Params | Required | Descriptions |
|--------|----------|--------------|
| access_token | YES | |
| score | YES | Total score of user |
| time | YES | Total time |
| match_id | YES | The match id of the match |

**Respond's example**:

```
{
  "status" : 200,
  "data": {
    "message" : "success"
  }
}
```

**Possible errors**: 301, 302, 401

## Status code

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 301 | Authentication error. It means your access token is invalid |
| 302 | Syntax error. The request you made is not follow the current syntax |
| 401 | Can not find record |
