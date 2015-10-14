angular.module('starter.controllers', [])

.controller('categoriesController', function($scope, $http, $state, CategoryId) {
  $http.get('/categories')
    .success(function(data) {
      console.log('Categories Success', data);
      $scope.categoriesData = data;
    })
    .error(function(data) {
      console.log('Something went wrong when get categories', data);
    });

  $scope.takeQuiz = function(idValue) {
    CategoryId.setId(idValue);
    console.log(idValue);
    console.log(CategoryId.getId());
    $state.go('questions');
  };
})

.controller('questionsController', function($scope, $http, CategoryId) {
  // $http.get('http://se2015-quizapp.herokuapp.com/categories/2/questions')
  $http.get('/questions' + '?category=' + CategoryId.getId())
    .success(function(data) {
      console.log('Questions Success', data);
      console.log(CategoryId.getId());
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
