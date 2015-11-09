angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'starter.services', 'ngOpenFB', 'chart.js'])

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

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
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
    })

    .state('menu', {
      url: '/menu',
      views: {
        '': {
          templateUrl: 'templates/menuView.html',
          controller: 'menuController'
        }
      }
    })

    .state('profile', {
      url: '/profile',
      views: {
        '': {
          templateUrl: 'templates/profileView.html',
          controller: 'profileController'
        }
      }
    })

    .state('challenge', {
      url: '/challenge',
      views: {
        '': {
          templateUrl: 'templates/challengeView.html',
          controller: 'challengeController'
        }
      }
    })

    .state('mutualProfile', {
      url: 'mutualProfile',
      views: {
        '': {
          templateUrl: 'templates/mutualProfileView.html',
          controller: 'mutualProfileController'
        }
      }
    });

  $urlRouterProvider.otherwise('/login');

});
