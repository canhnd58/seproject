angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    ngFB.init({appId: '1653563448265048'});

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
      views: {
        '': {
          templateUrl: 'templates/answerQuestionView.html',
          controller: 'questionsController'
        }
      }
    })

    .state('categories', {
      url: '/categories',
      views: {
        '': {
          templateUrl: 'templates/categoriesSelectView.html',
          controller: 'categoriesController'
        }
      }
    })

    .state('login', {
      url: '/login',
      views: {
        '': {
          templateUrl: 'templates/loginView.html',
          controller: 'loginController'
        }
      }
  });

  $urlRouterProvider.otherwise('/login');

});
