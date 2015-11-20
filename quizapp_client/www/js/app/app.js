var starter = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
                          'ionic-material', 'ngOpenFB', 'chart.js']);

angular.module('starter.controllers', []);

angular.module('starter.services', []);

starter.constant('appConstants', {
  APP_FACEBOOK_ID: '1653563448265048',
  // SERVER_URL: 'http://se2015-quizapp.herokuapp.com',
  SERVER_URL: '',
  TIMER: 30000,
  BLUECOLOR: '#97BBCD',
  REDCOLOR: '#F7464A',
  QUESTIONSRESULT: ["WRONG", "OK", "GOOD", "GREAT", "EXCELLENT", "AMAZING",
                    "EXPERT", "GENIUS", "UNSTOPPABLE", "GODLIKE", "BEYOND GODLIKE"]
})

starter.run(function($ionicPlatform, ngFB, appConstants) {
  $ionicPlatform.ready(function() {
    // Init Facebook app Id
    ngFB.init({appId: appConstants.APP_FACEBOOK_ID});

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

starter.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
    .state('questions', {
      url: '/questions',
      views: {
        '': {
          templateUrl: 'templates/answerQuestionView.html',
          controller: 'questions'
        }
      }
    })

    .state('categories', {
      url: '/categories',
      views: {
        '': {
          templateUrl: 'templates/categoriesSelectView.html',
          controller: 'categories'
        }

      }
    })

    .state('login', {
      url: '/login',
      views: {
        '': {
          templateUrl: 'templates/loginView.html',
          controller: 'login'
        }
      }
    })

    .state('menu', {
      url: '/menu',
      views: {
        '': {
          templateUrl: 'templates/menuView.html',
          controller: 'menu'
        }
      }
    })

    .state('profile', {
      url: '/profile',
      views: {
        '': {
          templateUrl: 'templates/profileView.html',
          controller: 'profile'
        }
      }
    })

    .state('challenge', {
      url: '/challenge',
      views: {
        '': {
          templateUrl: 'templates/challengeView.html',
          controller: 'challenge'
        }
      }
    })

    .state('mutualProfile', {
      url: 'mutualProfile',
      views: {
        '': {
          templateUrl: 'templates/mutualProfileView.html',
          controller: 'mutualProfile'
        }
      }
    });

  $ionicConfigProvider.views.maxCache(0);

  $urlRouterProvider.otherwise('/login')

});
