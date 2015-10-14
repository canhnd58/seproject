angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('questions', {
      url: '/questions',
      templateUrl: 'templates/answerQuestionView.html',
      controller: 'questionsController'
    })

    .state('categories', {
      url: '/categories',
      templateUrl: 'templates/categoriesSelectView.html',
      controller: 'categoriesController'
  });

  $urlRouterProvider.otherwise('/categories');

});
