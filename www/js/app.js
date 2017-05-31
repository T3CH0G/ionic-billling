// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'satellizer', 'permission'])

.run(function($ionicPlatform, $rootScope, $auth, $state, PermPermissionStore) {

  $rootScope.logout = function() {

      $auth.logout().then(function() {

          // Remove the authenticated user from local storage
          localStorage.removeItem('user');

          // Remove the current user info from rootscope
          $rootScope.currentUser = null;
          $state.go('app.auth');
      });
      }

  $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));

  // Define anonymous role
    PermPermissionStore
    .definePermission('anonymous', function(stateParams) {
    // If the returned value is *truthy* then the user has the role, otherwise they don't
    // var User = JSON.parse(localStorage.getItem('user')); 
    // console.log("anonymous ", $auth.isAuthenticated()); 
    if (!$auth.isAuthenticated()) {
    return true; // Is anonymous
    }
    return false;
    });

    PermPermissionStore
    .definePermission('isloggedin', function(stateParams) {
    // If the returned value is *truthy* then the user has the role, otherwise they don't
    // console.log("isloggedin ", $auth.isAuthenticated()); 
    if ($auth.isAuthenticated()) {
    return true; // Is loggedin
    }
    return false;
    });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {

  $authProvider.loginUrl = 'http://localhost:8000/api/authenticate';

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.auth', {
    url: '/auth',
    data: {
        permissions: {
          except: ['isloggedin'],
          redirectTo: 'app.companies'
        }
      },
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('app.companies', {
    url: '/companies',
    data: {
        permissions: {
          except: ['anonymous'],
          redirectTo: 'app.auth'
        }
      },
    views: {
      'menuContent': {
        templateUrl: 'templates/companies.html',
        controller: 'CompaniesCtrl'
      }
    }
  })
  .state('app.clients', {
    url: '/clients',
    data: {
        permissions: {
          except: ['anonymous'],
          redirectTo: 'app.auth'
        }
      },
    views: {
      'menuContent': {
        templateUrl: 'templates/clients.html',
        controller: 'ClientsCtrl'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.company', {
    url: '/companies/:companyId',
    views: {
      'menuContent': {
        templateUrl: 'templates/company.html',
        controller: 'CompanyCtrl'
      }
    }
  })

  .state('app.client', {
    url: '/clients/:clientId',
    views: {
      'menuContent': {
        templateUrl: 'templates/client.html',
        controller: 'ClientCtrl'
      }
    }
  })

  .state('app.quotations', {
    url: '/quotations',
    views: {
      'menuContent': {
        templateUrl: 'templates/quotations.html',
        controller: 'QuotationsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/app/auth');
  $urlRouterProvider.otherwise('/app/playlists');
});
