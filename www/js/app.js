// Ionic Starter App

angular.module('underscore', [])
  .factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
  });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('TrumpMEME', [
  'ionic',
  'angularMoment',
  'TrumpMEME.controllers',
  'TrumpMEME.directives',
  'TrumpMEME.filters',
  'TrumpMEME.services',
  'TrumpMEME.factories',
  'TrumpMEME.config',
  'TrumpMEME.views',
  'underscore',
  'ngMap',
  'ngResource',
  'ngCordova',
  'slugifier',
  'ionic.contrib.ui.tinderCards',
  'youtube-embed',
  'angular-cache'
])

.run(function($ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout, $window, $state, InitialRun, CacheFactory) {

  $ionicPlatform.on("deviceready", function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && $window.cordova.plugins && window.cordova.plugins.Keyboard) {
      console.log('Plugin available');
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (InitialRun.isInitialRun()) {
      InitialRun.setInitialRun();
      console.log('$window.localStorage.initialRun ' + $window.localStorage.initialRun);
      console.log('after factory isInitialRun');
      console.log('$window.localStorage.redditClientId ' + $window.localStorage.redditClientId);
      console.log('$window.localStorage.giphyApiKey ' + $window.localStorage.giphyApiKey);
      console.log('$window.localStorage.imgurClientId ' + $window.localStorage.imgurClientId);
      $state.go('intro.interstitial');
    } else {
      $state.go('app.gallery-reddit');
    }

    CacheFactory("redditDataCache", { storageMode: "localStorage" });
    CacheFactory("imgurDataCache", { storageMode: "localStorage" });
    CacheFactory("giphyDataCache", { storageMode: "localStorage" });
    //PushNotificationsService.register();

  });

  // This fixes transitions for transparent background views
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.name.indexOf('auth.walkthrough') > -1) {
      // set transitions to android to avoid weird visual effect in the walkthrough transitions
      $timeout(function() {
        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
        console.log("setting transition to android and disabling swipe back");
      }, 0);
    }

  });
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
    if (toState.name.indexOf('app.feeds-categories') > -1) {
      // Restore platform default transition. We are just hardcoding android transitions to auth views.
      $ionicConfig.views.transition('platform');
      // If it's ios, then enable swipe back again
      if (ionic.Platform.isIOS()) {
        $ionicConfig.views.swipeBackEnabled(true);
      }
      console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());

    }
  });

  $ionicPlatform.on("resume", function() {
    PushNotificationsService.register();
  });

})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

    .state('intro', {
    url: "/intro",
    templateUrl: "views/intro/intro.html",
    abstract: true,
    controller: 'IntroCtrl'
  })

  .state('intro.interstitial', {
    url: '/interstitial',
    templateUrl: "views/intro/interstitial.html"
  })

  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })

  // .state('auth.walkthrough', {
  //   url: '/walkthrough',
  //   templateUrl: "views/auth/walkthrough.html"
  // })

  .state('auth.login', {
    url: '/login',
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl'
  })

  .state('auth.signup', {
    url: '/signup',
    templateUrl: "views/auth/signup.html",
    controller: 'SignupCtrl'
  })

  .state('auth.forgot-password', {
    url: "/forgot-password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })


  //memegenerator
  .state('memegenerator', {
    url: "/memegenerator",
    templateUrl: "views/app/memegenerator-template.html",
    abstract: true,
    controller: 'AuthCtrl'
  })


  .state('memegenerator.memegenerator', {
    url: '/memegenerator',
    views: {
      'menuContent': {
        templateUrl: "views/app/memegenerator/choosepicture.html",
        controller: 'MemegenCtrl'
      }
    }
  })

  .state('memegenerator.makeit', {
    url: '/makeit',
    views: {
      'menuContent': {
        templateUrl: "views/app/memegenerator/makeit.html",
        controller: 'MakeItCtrl'
      }
    }
  })

  .state('memegenerator.popular', {
    url: '/popular',
    views: {
      'menuContent': {
        templateUrl: "views/app/memegenerator/popular.html",
        controller: 'PopularCtrl'
      }
    }
  })

  //GALLERIES
  .state('app.gallery-imgur', {
    url: "/gallery-imgur",
    views: {
      'menuContent': {
        templateUrl: "views/app/gallery/gallery-imgur.html",
        controller: 'GalleryCtrl'
      }
    }
  })

  .state('app.img_detail', {
    url: "img_detail/:imgTitle/:imgLink/:imgSource",
    views: {
      'menuContent': {
        templateUrl: "views/app/gallery/img_detail.html",
        controller: 'ImgCtrl'
      }
    },
    resolve: {
      img_data: function(ImgurService, ImageService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
          template: 'Loading image ...'
        });

        var imgTitle = $stateParams.imgTitle;
        console.log('$stateParams.imgTitle ' + imgTitle);
        var imgLink = $stateParams.imgLink;
        console.log('$stateParams.imgLink ' + imgLink);
        var imgSource = $stateParams.imgSource;
        console.log('$stateParams.imgSource ' + imgSource);

        return ImageService.getImg(imgTitle, imgLink, imgSource);
      }
    }
  })

  .state('app.gallery-giphy', {
    url: "/gallery-giphy",
    views: {
      'menuContent': {
        templateUrl: "views/app/gallery/gallery-giphy.html",
        controller: 'GalleryGiphyCtrl'
      }
    }
  })

  .state('app.gallery-reddit', {
    url: "/gallery-reddit",
    views: {
      'menuContent': {
        templateUrl: "views/app/gallery/gallery-reddit.html",
        controller: 'GalleryRedditCtrl'
      }
    }
  })

  //MISCELLANEOUS
  .state('app.miscellaneous', {
    url: "/miscellaneous",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/miscellaneous.html"
      }
    }
  })

  .state('app.maps', {
    url: "/miscellaneous/maps",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/maps.html",
        controller: 'MapsCtrl'
      }
    }
  })

  .state('app.image-picker', {
    url: "/miscellaneous/image-picker",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/image-picker.html",
        controller: 'ImagePickerCtrl'
      }
    }
  })

  //LAYOUTS
  .state('app.layouts', {
    url: "/layouts",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/layouts.html"
      }
    }
  })

  .state('app.tinder-cards', {
    url: "/layouts/tinder-cards",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/tinder-cards.html",
        controller: 'TinderCardsCtrl'
      }
    }
  })

  .state('app.slider', {
    url: "/layouts/slider",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/slider.html"
      }
    }
  })

  //FEEDS
  .state('app.feeds-categories', {
    url: "/feeds-categories",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feeds-categories.html",
        controller: 'FeedsCategoriesCtrl'
      }
    }
  })

  .state('app.category-feeds', {
    url: "/category-feeds/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/category-feeds.html",
        controller: 'CategoryFeedsCtrl'
      }
    }
  })

  .state('app.feed-entries', {
    url: "/feed-entries/:categoryId/:sourceId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feed-entries.html",
        controller: 'FeedEntriesCtrl'
      }
    }
  })

  //NEWS
  .state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "views/app/news.html",
        controller: 'NewsCtrl'
      }
    }
  })

  .state('app.legal', {
    url: "/legal",
    views: {
      'menuContent': {
        templateUrl: "views/app/legal.html",
        controller: 'NewsCtrl'
      }
    }
  })

  .state('app.more', {
    url: "/more",
    views: {
      'menuContent': {
        templateUrl: "views/app/more.html",
        controller: 'NewsCtrl'
      }
    }
  })

  //WORDPRESS
  .state('app.wordpress', {
    url: "/wordpress",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress.html",
        controller: 'WordpressCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/wordpress/:postId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress_post.html",
        controller: 'WordpressPostCtrl'
      }
    },
    resolve: {
      post_data: function(PostService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
          template: 'Loading post ...'
        });

        var postId = $stateParams.postId;
        return PostService.getPost(postId);
      }
    }
  })

  //OTHERS
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.forms', {
    url: "/forms",
    views: {
      'menuContent': {
        templateUrl: "views/app/forms.html"
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "views/app/profile.html"
      }
    }
  })

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    }
  })

  .state('app.gallery', {
    url: "/gallery",
    views: {
      'menuContent': {
        templateUrl: "views/app/gallery/gallery.html",
        controller: 'BookMarksCtrl'
      }
    }
  })

  .state('app.mymemes', {
    url: "/mymemes",
    views: {
      'menuContent': {
        templateUrl: "views/app/mymemes.html",
        controller: 'BookMarksCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('app/cover');
  //$urlRouterProvider.otherwise('/auth/walkthrough');
});

window.onerror = function(errorMsg, url, lineNumber) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};
