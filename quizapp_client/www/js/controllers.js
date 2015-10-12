angular.module('starter.controllers', [])

.controller('questionsController', function($scope, $http) {
  // $http.get('http://se2015-quizapp.herokuapp.com/categories/2/questions')
  $http.get('/questions')
    .success(function(data) {
      console.log('Success', data);
      $scope.cnt = 0;
      $scope.clientData = data;
      $scope.clientSideList = $scope.clientData[0];
    })
    .error(function(data) {
      console.log('Something went wrong', data);
    });

  $scope.score = 0;
  $scope.finished = false;

  $scope.user = {
    choice: null
  };

  $scope.checkAnswer = function() {
    $scope.Submitted = true;
    if ($scope.user.choice.is_correct == true) {
      $scope.correct = true;
      $scope.score += $scope.clientSideList.score;
    } else $scope.correct = false;
    if ($scope.cnt + 1 == $scope.clientData.length) $scope.finished = true;
  };

  $scope.nextQuestion = function() {
    $scope.cnt = $scope.cnt + 1;
    $scope.clientSideList = $scope.clientData[$scope.cnt];
    $scope.Submitted = false;
  };
});
