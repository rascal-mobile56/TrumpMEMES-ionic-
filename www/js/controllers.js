angular.module('TrumpMEME.controllers', [])

.controller('CoverCtrl', function($scope, $ionicConfig) {

})

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

.controller('IntroCtrl', function($scope, $ionicConfig) {

})

.controller('NewsCtrl', function($scope, $ionicConfig, $cordovaEmailComposer) {
  $scope.sendFeedback = function() {
    $cordovaEmailComposer.isAvailable().then(function() {
      // is available
      var email = {
        to: '',
        cc: '',
        bcc: '',
        subject: 'TrumpMEMES feedback',
        body: '',
        isHtml: true
      };

      $cordovaEmailComposer.open(email).then(null, function() {
        // user cancelled email
      });
    }, function() {
      // not available
      console.log('cordovaEmailComposer not available');
    });


  };

})

.controller('PopularCtrl', function($scope, $ionicConfig, $ionicPopup, $state) {
  $ionicPopup.alert({
    title: 'Popular',
    template: 'This feature is not available'
  });
  $state.go('app.gallery-reddit');

})

// MEMEGENERATOR
.controller('MemegenCtrl', function($scope, $ionicConfig, $ionicActionSheet, $cordovaCamera, $state, customService) {

  /******* get picture From gallery or camera*****************/

  $scope.getPicture = function() {
    var ShareSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<div class="gallery-s">Choose existing</div>'
      }, {
        text: '<div class="camera-s"> Take from camera</div>'
      }, ],
      cancelText: '<div class="cancel-s">Cancel</div>',
      buttonClicked: function(index) {
        ShareSheet();
        //NSLog(@"Share sheet clicked.");
        if (index == '0' || index == '0') {
          ShareSheet();
          /** get picture from gallery**/
          var options1 = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 1500,
            targetHeight: 1500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };

          $cordovaCamera.getPicture(options1).then(function(imageData) {


            var image = "data:image/png;base64," + imageData;
            customService.getImages = image;
            $state.go('memegenerator.makeit');
          }, function(err) {
            // error
          });
        }
        if (index == '1' || index == '1') {
          ShareSheet();
          /** get picture from camera**/
          var options2 = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 1500,
            targetHeight: 1500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };

          $cordovaCamera.getPicture(options2).then(function(imageData) {

            var image = "data:image/png;base64," + imageData;
            customService.getImages = image;
            $state.go('memegenerator.makeit');
          }, function(err) {
            // error
          });

        }
      }
    });

  };
})

.controller('MakeItCtrl', function($scope, $state, $ionicActionSheet, $ionicLoading, $cordovaCamera, customService) {
  $scope.user = {};
  $scope.show = {};
  $scope.dataShow = false;
  $scope.dataShow2 = false;

  console.log("MakeItCtrl ");
  $scope.editIamge = customService.getImages;
  //console.log('$scope.editIamge ' + $scope.editIamge);

  /**** Make It function start******/

  $scope.makeIt = function() {
    $scope.headerText = $scope.user.header;
    $scope.footerText = $scope.user.footer;
    $scope.dataShow = true;
    console.log("$scope.makeIt ");
    console.log("$scope.dataShow " + $scope.dataShow);

    setTimeout(function() {
      html2canvas($("#imagess"), {
        onrendered: function(canvas) {
          document.body.appendChild(canvas);

          // Convert as image
          var data = canvas.toDataURL("image/png");
          var img = new Image();
          img.onload = function() {

          };
          img.src = data;
          $scope.editIamge = img;
          $scope.editIamgeUrl = data;
          //console.log('$scope.editIamgeUrl ' + $scope.editIamgeUrl);
          //angular.element( document.querySelector( '#divID' ) ).empty();
          //angular.element( document.querySelector( '#divID' ) ).append(img);

        }
      });
    }, 10000);
  };

  $scope.shareIt = function() {
    $scope.headerText = $scope.user.header;
    $scope.footerText = $scope.user.footer;
    $scope.dataShow = true;
    console.log("$scope.shareIt ");
    console.log("$scope.dataShow " + $scope.dataShow);
    $ionicLoading.show({
      template: 'Please wait, generating image data ...'
    });
    setTimeout(function() {
      html2canvas($("#imagess"), {
        onrendered: function(canvas) {
          //document.body.appendChild(canvas);

          // Convert as image

          var data = canvas.toDataURL("image/png");
          var img = new Image();
          img.onload = function() {
            $state.go('app.img_detail', {
              imgTitle: "New Meme",
              imgLink: $scope.editIamgeUrl,
              imgSource: "me"
            });

          };
          img.src = data;
          //$scope.editIamge = img;
          $scope.editIamgeUrl = data;
          //console.log('$scope.editIamgeUrl ' + $scope.editIamgeUrl);
          //angular.element( document.querySelector( '#divID' ) ).empty();
          //angular.element( document.querySelector( '#divID' ) ).append(img);

        }
      });
    }, 10000);

  };

  /****** Make It function End******/

  $scope.incfont = function() {
    //Higher limit
    console.log("incfont");
    curSize = parseInt($('#headerTxt').css('font-size')) + 2;
    console.log("curSize " + curSize);

    if (curSize <= 36)
      $('#headerTxt').css('font-size', curSize);
  };

  $scope.decfont = function() {
    //Lower limit
    console.log("#decfont");
    curSize = parseInt($('#headerTxt').css('font-size')) - 2;
    console.log("curSize " + curSize);
    if (curSize >= 20)
      $('#headerTxt').css('font-size', curSize);
  };

  $scope.incfont2 = function() {
    //Higher limit
    console.log("incfont2");
    curSize = parseInt($('#footerTxt').css('font-size')) + 2;
    console.log("curSize " + curSize);

    if (curSize <= 36)
      $('#footerTxt').css('font-size', curSize);
  };

  $scope.decfont2 = function() {
    //Lower limit
    console.log("#decfont2");
    curSize = parseInt($('#footerTxt').css('font-size')) - 2;
    console.log("curSize " + curSize);
    if (curSize >= 20)
      $('#footerTxt').css('font-size', curSize);
  };

})

// APP
.controller('AppCtrl', function($scope, $state, $ionicConfig, $rootScope) {
  console.log('AppCtrl');
  $scope.showFooter = true;

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      console.log('>' + toState.name);
      if (toState.name == "app.gallery-imgur" || toState.name == "app.gallery-giphy" || toState.name == "app.gallery-reddit") $scope.showFooter = true;
      else $scope.showFooter = false;
    });

  $scope.button = {};
  $scope.button.first = {};
  $scope.button.second = {};
  $scope.button.third = {};

  $scope.click = function(button) {
    $scope.button.first.clicked = false;
    $scope.button.second.clicked = false;
    $scope.button.third.clicked = false;

    button.clicked = true;
  };

})

// APP - GIPHY GALLERY
.controller('GalleryGiphyCtrl', function($scope, $state, $ionicConfig, $http, $ionicLoading, GiphyService, $window, CacheFactory) {
  console.log('GalleryGiphyCtrl');
  $scope.offset = 0;
  //$window.localStorage.giphyApiKey = undefined;
  $scope.giphyDataCache = CacheFactory.get("giphyDataCache");
  $scope.giphyDataCache.removeAll();
  console.log('$scope.giphyDataCache ' + $scope.giphyDataCache);

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    console.log('doRefresh scope.offset ' + $scope.offset);
    console.log('$window.localStorage.giphyApiKey ' + $window.localStorage.giphyApiKey);

    //USE GIPHY API KEY TO GET GIPHY RECENT POSTS
    GiphyService.getRecentPosts($scope.offset, $window.localStorage.giphyApiKey)
      .then(function(data) {
        $scope.giphyDataCache = data;
        console.log('getRecentPosts scope.offset ' + $scope.offset);
        $scope.offset += 101;
        console.log('getRecentPosts scope.offset ' + $scope.offset);

        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      });

  };

  $scope.loadMoreData = function() {
    console.log('loadMoreData scope.offset ' + $scope.offset);
    console.log('$window.localStorage.giphyApiKey ' + $window.localStorage.giphyApiKey);
    console.log('loadMoreData scope.offset ' + $scope.offset);
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    //USE GIPHY API KEY TO GET GIPHY RECENT POSTS
    GiphyService.getRecentPosts($scope.offset, $window.localStorage.giphyApiKey)
      .then(function(data) {
        $scope.giphyDataCache = $scope.giphyDataCache.concat(data);

        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      });
  };

  $scope.doRefresh();

})

// APP - REDDIT GALLERY
.controller('GalleryRedditCtrl', function($scope, $state, $ionicConfig, $http, $ionicLoading, RedditService, $window, CacheFactory) {
  console.log('GalleryRedditCtrl');
  $scope.afterId = 'initialAfterId';
  $scope.redditDataCache = CacheFactory.get("redditDataCache");
  $scope.redditDataCache.removeAll();
  console.log('$scope.redditDataCache ' + $scope.redditDataCache);

  $scope.doRefresh = function() {

    console.log('$window.localStorage.initialRun ' + $window.localStorage.initialRun);
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    console.log('doRefresh scope.afterId ' + $scope.afterId);
    console.log('$window.localStorage.redditClientId ' + $window.localStorage.redditClientId);
    console.log('$window.localStorage.redditSecret ' + $window.localStorage.redditSecret);

    //USE REDDIT CLIENTID TO GET REDDIT ACCESSTOKEN OAUTH2
    RedditService.getRedditAccessToken($window.localStorage.redditClientId, $window.localStorage.redditSecret)
      .then(function(data) {
        $scope.data = data;
        console.log('GalleryRedditCtrl.doRefresh data.data.access_token ' + data.data.access_token);
        $window.localStorage.redditAccessToken = data.data.access_token.replace(/"/g, "");
        console.log('GalleryRedditCtrl.doRefresh $window.localStorage.redditAccessToken ' + $window.localStorage.redditAccessToken);
        console.log('$window.localStorage.redditAccessToken ' + $window.localStorage.redditAccessToken);

        //USE REDDIT ACCESSTOKEN TO GET REDDIT RECENT POSTS
        RedditService.getRecentPosts($scope.afterId, $window.localStorage.redditAccessToken)
          .then(function(data) {
            $scope.redditDataCache = data;
            $scope.updateAfterId($scope.redditDataCache); //get this from last item in gallery_data_reddit

            //console.log('gallery_data_reddit ' + JSON.stringify($scope.redditDataCache);
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
          });
      });
  };


  $scope.loadMoreData = function() {
    //get new after id
    console.log('loadMoreData scope.afterId ' + $scope.afterId);
    console.log('$window.localStorage.redditClientId ' + $window.localStorage.redditClientId);
    console.log('$window.localStorage.redditSecret ' + $window.localStorage.redditSecret);
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    //USE REDDIT CLIENTID TO GET REDDIT ACCESSTOKEN OAUTH2
    RedditService.getRedditAccessToken($window.localStorage.redditClientId, $window.localStorage.redditSecret)
      .then(function(data) {
        $scope.data = data;
        console.log('GalleryRedditCtrl.loadMoreData data.data.access_token ' + data.data.access_token);
        $window.localStorage.redditAccessToken = data.data.access_token.replace(/"/g, "");
        console.log('$window.localStorage.redditAccessToken ' + $window.localStorage.redditAccessToken);

        RedditService.getRecentPosts($scope.afterId, $window.localStorage.redditAccessToken)
          .then(function(data) {
            //We will update this value in every request because new posts can be created
            $scope.redditDataCache = $scope.redditDataCache.concat(data);
            console.log('$scope.redditDataCache ' + JSON.stringify($scope.redditDataCache));

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();

          });
      });

  };

  $scope.goToImg = function(link) {
    window.open(link, '_blank', 'location=yes');
  };

  $scope.updateAfterId = function() {
    var data = $scope.redditDataCache;
    console.log('$scope.afterId ' + $scope.afterId);
    //console.log('data ' + JSON.stringify(data));
    var ind = data.length - 1;
    //console.log('data[ind]' + JSON.stringify(data[ind]));
    var afterId = data[ind].kind + '_' + data[ind].data.id;
    $scope.afterId = afterId;
    console.log('new $scope.afterId ' + $scope.afterId);

  };

  $scope.doRefresh();
})

// APP - IMGUR GALLERY
.controller('GalleryCtrl', function($scope, $state, $ionicConfig, $http, $ionicLoading, ImgurService, $window, CacheFactory) {
  console.log('GalleryCtrl');
  $scope.imgurDataCache = CacheFactory.get("imgurDataCache");
  $scope.imgurDataCache.removeAll();
  console.log('$scope.imgurDataCache ' + $scope.imgurDataCache);
  $scope.page = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    console.log('doRefresh scope.page ' + $scope.page);
    console.log('$window.localStorage.imgurClientId ' + $window.localStorage.imgurClientId);

    ImgurService.getRecentPosts($scope.page, $window.localStorage.imgurClientId)
      .then(function(data) {
        $scope.imgurDataCache = data;
        //console.log('gallery_data_imgur ' + $scope.gallery_data_imgur);
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      });
  };

  $scope.loadMoreData = function() {
    $scope.page += 1;
    console.log('loadMoreData scope.page ' + $scope.page);
    console.log('$window.localStorage.imgurClientId ' + $window.localStorage.imgurClientId);
    $ionicLoading.show({
      template: 'Loading memes...'
    });
    ImgurService.getRecentPosts($scope.page, $window.localStorage.imgurClientId)
      .then(function(data) {
        //We will update this value in every request because new posts can be created
        $scope.imgurDataCache = $scope.imgurDataCache.concat(data);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      });
  };

  $scope.goToImg = function(link) {
    window.open(link, '_blank', 'location=yes');
  };

  $scope.doRefresh();
})


.controller('ImgCtrl', function($scope, img_data, $ionicLoading, $cordovaSocialSharing, $cordovaClipboard, $ionicPopup, $ionicModal, MSG_TAG) {

  $scope.img = img_data;
  $ionicLoading.hide();

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading image...'
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });

  $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';

  $scope.showImage = function(index, url) {
    console.log('$scope.showImage ' + index + ' ' + url);
    switch (index) {
      case 1:
        $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';
        break;
      case 2:
        $scope.imageSrc = 'http://ionicframework.com/img/ionic_logo.svg';
        break;
      case 3:
        $scope.imageSrc = url;
        break;
    }
    $scope.openModal();
  };

  $scope.openInExternalBrowser = function(url) {
    // Open in external browser
    window.open(url, '_system', 'location=yes');
  };

  $scope.openInAppBrowser = function(url) {
    // Open in app browser
    console.log('openInAppBrowser url ' + url);
    //window.open(url, '_blank', 'location=yes');
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
    //ref.close();
  };

  $scope.openCordovaWebView = function(url) {
    // Open cordova webview if the url is in the whitelist otherwise opens in app browser
    window.open(url, '_self');
  };

  $scope.share = function(link) {
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };

  $scope.shareViaEmail = function(link) {
    window.plugins.socialsharing.shareViaEmail(
      null, //'Message', // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
      'Hey look at this Trump MEME',
      null, // ['to@person1.com', 'to@person2.com'], // TO: must be null or an array
      null, // ['cc@person1.com'], // CC: must be null or an array
      null, // BCC: must be null or an array
      link, // FILES: can be null, a string, or an array
      function() {
        console.log('share via email ok');
      },
      function(errormsg) {
        $ionicPopup.alert({
          title: 'TrumpMEMES',
          template: errormsg
        });
      });
  };

  $scope.shareViaSMS = function(link) {
    console.log('share via sms ok');
    console.log('link ' + link);
    link = link.split("?s=")[0];
    console.log('link ' + link);
    window.plugins.socialsharing.shareViaSMS({
      'message': MSG_TAG,
      'subject': 'Hey look at this Trump MEME',
      'image': link
    }, null);
  };

  $scope.shareViaFacebook = function(link) {
    window.plugins.socialsharing.shareViaFacebook(MSG_TAG, link,
      link,
      function() {
        console.log('share via fb ok');
      },
      function(errormsg) {
        $ionicPopup.alert({
          title: 'TrumpMEMES',
          template: errormsg
        });
      });
  };

  $scope.shareViaTwitter = function(link) {
    window.plugins.socialsharing.shareViaTwitter(MSG_TAG, link,
      link,
      function() {
        console.log('share via twitter ok');
      },
      function(errormsg) {
        $ionicPopup.alert({
          title: 'TrumpMEMES',
          template: errormsg
        });
      });
  };

  $scope.shareViaInstagram = function(link) {
    window.plugins.socialsharing.shareViaInstagram(link,
      link,
      function() {
        console.log('share via instagram ok');
      },
      function(errormsg) {
        $ionicPopup.alert({
          title: 'TrumpMEMES',
          template: errormsg
        });
      });
  };

  $scope.canShareVia = function(link) {
    window.plugins.socialsharing.canShareVia(socialType, null, null, link);
  };

  $scope.canShareViaEmail = function() {
    window.plugins.socialsharing.canShareViaEmail();
  };

  $scope.copy = function(text) {
    console.log('copy ' + text);
    $cordovaClipboard
      .copy(text)
      .then(function() {
          // success
          console.log('copied');
          //$scope.showAlert();
          $ionicPopup.alert({
            title: 'TrumpMEMES',
            template: 'Text copied'
          });

        },
        function() {
          // error
          console.log('error');
        });
  };

  $scope.paste = function() {
    $cordovaClipboard
      .paste()
      .then(function(result) {
        // success, use result
      }, function() {
        // error
      });
  };

  // An alert dialog
  $scope.showAlert = function(text) {
    $ionicPopup.alert({
      title: 'TrumpMemes',
      template: text
    });
    };

})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $templateCache, $q, $rootScope) {
  $scope.doLogIn = function() {
    $state.go('app.feeds-categories');
  };

  $scope.user = {};

  $scope.user.email = "john@doe.com";
  $scope.user.pin = "12345";

  // We need this for the form validation
  $scope.selected_tab = "";

  $scope.$on('my-tabs-changed', function(event, data) {
    $scope.selected_tab = data.title;
  });

})

.controller('SignupCtrl', function($scope, $state) {
  $scope.user = {};

  $scope.user.email = "john@doe.com";

  $scope.doSignUp = function() {
    $state.go('app.feeds-categories');
  };
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
  $scope.recoverPassword = function() {
    $state.go('app.feeds-categories');
  };

  $scope.user = {};
})

.controller('RateApp', function($scope) {
  $scope.rateApp = function() {
    if (ionic.Platform.isIOS()) {
      //you need to set your own ios app id
      AppRate.preferences.storeAppURL.ios = '1234555553>';
      AppRate.promptForRating(true);
    } else if (ionic.Platform.isAndroid()) {
      //you need to set your own android app id
      AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
      AppRate.promptForRating(true);
    }
  };
})

.controller('SendMailCtrl', function($scope) {
  $scope.sendMail = function() {
    cordova.plugins.email.isAvailable(
      function(isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to: 'envato@kraftwerking.com',
          cc: 'hello@kraftwerking.com',
          // bcc:     ['john@doe.com', 'jane@doe.com'],
          subject: 'Greetings',
          body: 'How are you? Nice greetings from TrumpMEMES'
        });
      }
    );
  };
})

.controller('MapsCtrl', function($scope, $ionicLoading) {

  $scope.info_position = {
    lat: 43.07493,
    lng: -89.381388
  };

  $scope.center_position = {
    lat: 43.07493,
    lng: -89.381388
  };

  $scope.my_location = "";

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

  $scope.centerOnMe = function() {

    $scope.positions = [];

    $ionicLoading.show({
      template: 'Loading...'
    });

    // with this function you can get the user’s current position
    // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.current_position = {
        lat: pos.G,
        lng: pos.K
      };
      $scope.my_location = pos.G + ", " + pos.K;
      $scope.map.setCenter(pos);
      $ionicLoading.hide();
    });
  };
})

.controller('AdsCtrl', function($scope, $ionicActionSheet, AdMob, iAd) {

  $scope.manageAdMob = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [{
        text: 'Show Banner'
      }, {
        text: 'Show Interstitial'
      }],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        AdMob.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if (button.text == 'Show Banner') {
          console.log("show banner");
          AdMob.showBanner();
        }

        if (button.text == 'Show Interstitial') {
          console.log("show interstitial");
          AdMob.showInterstitial();
        }

        return true;
      }
    });
  };

  $scope.manageiAd = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [{
        text: 'Show iAd Banner'
      }, {
        text: 'Show iAd Interstitial'
      }],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show - Interstitial only works in iPad',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        iAd.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if (button.text == 'Show iAd Banner') {
          console.log("show iAd banner");
          iAd.showBanner();
        }
        if (button.text == 'Show iAd Interstitial') {
          console.log("show iAd interstitial");
          iAd.showInterstitial();
        }
        return true;
      }
    });
  };
})

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function($scope, $http) {
  $scope.feeds_categories = [];

  $http.get('feeds-categories.json').success(function(response) {
    $scope.feeds_categories = response;
  });
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
  $scope.category_sources = [];

  $scope.categoryId = $stateParams.categoryId;

  $http.get('feeds-categories.json').success(function(response) {
    var category = _.find(response, {
      id: $scope.categoryId
    });
    $scope.categoryTitle = category.title;
    $scope.category_sources = category.feed_sources;
  });
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
  $scope.feed = [];

  var categoryId = $stateParams.categoryId,
    sourceId = $stateParams.sourceId;

  $scope.doRefresh = function() {

    $http.get('feeds-categories.json').success(function(response) {

      $ionicLoading.show({
        template: 'Loading entries...'
      });

      var category = _.find(response, {
          id: categoryId
        }),
        source = _.find(category.feed_sources, {
          id: sourceId
        });

      $scope.sourceTitle = source.title;

      FeedList.get(source.url)
        .then(function(result) {
          $scope.feed = result.feed;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }, function(reason) {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        });
    });
  };

  $scope.doRefresh();

  $scope.bookmarkPost = function(post) {
    $ionicLoading.show({
      template: 'Post Saved!',
      noBackdrop: true,
      duration: 1000
    });
    BookMarkService.bookmarkFeedPost(post);
  };
})

// SETTINGS
.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
  $scope.airplaneMode = true;
  $scope.wifi = false;
  $scope.bluetooth = true;
  $scope.personalHotspot = true;

  $scope.checkOpt1 = true;
  $scope.checkOpt2 = true;
  $scope.checkOpt3 = false;

  $scope.radioChoice = 'B';

  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      // buttons: [
      // { text: '<b>Share</b> This' },
      // { text: 'Move' }
      // ],
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function() {
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        $state.go('auth.walkthrough');
      }
    });

  };
})

// TINDER CARDS
.controller('TinderCardsCtrl', function($scope, $http) {

  $scope.cards = [];


  $scope.addCard = function(img, name) {
    var newCard = {
      image: img,
      name: name
    };
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  };

  $scope.addCards = function(count) {
    $http.get('http://api.randomuser.me/?results=' + count).then(function(value) {
      angular.forEach(value.data.results, function(v) {
        $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
      });
    });
  };

  $scope.addFirstCards = function() {
    $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
    $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
  };

  $scope.addFirstCards();
  $scope.addCards(5);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    $scope.addCards(1);
  };

  $scope.transitionOut = function(card) {
    console.log('card transition out');
  };

  $scope.transitionRight = function(card) {
    console.log('card removed to the right');
    console.log(card);
  };

  $scope.transitionLeft = function(card) {
    console.log('card removed to the left');
    console.log(card);
  };
})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $ionicPopup, $rootScope, BookMarkService, $state) {
  $ionicPopup.alert({
    title: 'My memes',
    template: 'Favorites are not available'
  });
  $state.go('app.mymemes');

})

// WORDPRESS
.controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading posts...'
    });

    //Always bring me the latest posts => page=1
    PostService.getRecentPosts(1)
      .then(function(data) {
        $scope.totalPages = data.pages;
        $scope.posts = PostService.shortenPosts(data.posts);

        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.loadMoreData = function() {
    $scope.page += 1;

    PostService.getRecentPosts($scope.page)
      .then(function(data) {
        //We will update this value in every request because new posts can be created
        $scope.totalPages = data.pages;
        var new_posts = PostService.shortenPosts(data.posts);
        $scope.posts = $scope.posts.concat(new_posts);

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };

  $scope.moreDataCanBeLoaded = function() {
    return $scope.totalPages > $scope.page;
  };

  $scope.bookmarkPost = function(post) {
    $ionicLoading.show({
      template: 'Post Saved!',
      noBackdrop: true,
      duration: 1000
    });
    BookMarkService.bookmarkWordpressPost(post);
  };

  $scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

  $scope.post = post_data.post;
  $ionicLoading.hide();

  $scope.sharePost = function(link) {
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };
})


.controller('ImagePickerCtrl', function($scope, $rootScope, $cordovaCamera) {

  $scope.images = [];

  $scope.selImages = function() {

    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push(results[i]);
        }
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  };

  $scope.removeImage = function(image) {
    $scope.images = _.without($scope.images, image);
  };

  $scope.shareImage = function(image) {
    window.plugins.socialsharing.share(null, null, image);
  };

  $scope.shareAll = function() {
    window.plugins.socialsharing.share(null, null, $scope.images);
  };
})

;
