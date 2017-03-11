angular.module('TrumpMEME.services', [])

.service('FeedList', function($rootScope, FeedLoader, $q) {
  this.get = function(feedSourceUrl) {
    var response = $q.defer();
    //num is the number of results to pull form the source
    FeedLoader.fetch({
      q: feedSourceUrl,
      num: 20
    }, {}, function(data) {
      response.resolve(data.responseData);
    });
    return response.promise;
  };
})

.service('customService', function() {
  var self = this;

  self.getImages = '';
  // Might use a resource here that returns a JSON array

  // Some fake testing data

})

// PUSH NOTIFICATIONS
.service('PushNotificationsService', function($rootScope, $cordovaPush, NodePushServer, GCM_SENDER_ID) {
  /* Apple recommends you register your application for push notifications on the device every time it’s run since tokens can change. The documentation says: ‘By requesting the device token and passing it to the provider every time your application launches, you help to ensure that the provider has the current token for the device. If a user restores a backup to a device other than the one that the backup was created for (for example, the user migrates data to a new device), he or she must launch the application at least once for it to receive notifications again. If the user restores backup data to a new device or reinstalls the operating system, the device token changes. Moreover, never cache a device token and give that to your provider; always get the token from the system whenever you need it.’ */
  this.register = function() {
    var config = {};

    // ANDROID PUSH NOTIFICATIONS
    if (ionic.Platform.isAndroid()) {
      config = {
        "senderID": GCM_SENDER_ID
      };

      $cordovaPush.register(config).then(function(result) {
        // Success
        console.log("$cordovaPush.register Success");
        console.log(result);
      }, function(err) {
        // Error
        console.log("$cordovaPush.register Error");
        console.log(err);
      });

      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        console.log(JSON.stringify([notification]));
        switch (notification.event) {
          case 'registered':
            if (notification.regid.length > 0) {
              console.log('registration ID = ' + notification.regid);
              NodePushServer.storeDeviceToken("android", notification.regid);
            }
            break;

          case 'message':
            if (notification.foreground == "1") {
              console.log("Notification received when app was opened (foreground = true)");
            } else {
              if (notification.coldstart == "1") {
                console.log("Notification received when app was closed (not even in background, foreground = false, coldstart = true)");
              } else {
                console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)");
              }
            }

            // this is the actual push notification. its format depends on the data model from the push server
            console.log('message = ' + notification.message);
            break;

          case 'error':
            console.log('GCM error = ' + notification.msg);
            break;

          default:
            console.log('An unknown GCM event has occurred');
            break;
        }
      });

      // WARNING: dangerous to unregister (results in loss of tokenID)
      // $cordovaPush.unregister(options).then(function(result) {
      //   // Success!
      // }, function(err) {
      //   // Error
      // });
    }

    if (ionic.Platform.isIOS()) {
      config = {
        "badge": true,
        "sound": true,
        "alert": true
      };

      $cordovaPush.register(config).then(function(result) {
        // Success -- send deviceToken to server, and store for future use
        console.log("result: " + result);
        NodePushServer.storeDeviceToken("ios", result);
      }, function(err) {
        console.log("Registration error: " + err);
      });

      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        console.log(notification.alert, "Push Notification Received");
      });
    }
  };
})


// BOOKMARKS FUNCTIONS
.service('BookMarkService', function(_, $rootScope) {

  this.bookmarkFeedPost = function(bookmark_post) {

    var user_bookmarks = !_.isUndefined(window.localStorage.TrumpMEMES_feed_bookmarks) ?
      JSON.parse(window.localStorage.TrumpMEMES_feed_bookmarks) : [];

    //check if this post is already saved

    var existing_post = _.find(user_bookmarks, function(post) {
      return post.link == bookmark_post.link;
    });

    if (!existing_post) {
      user_bookmarks.push({
        link: bookmark_post.link,
        title: bookmark_post.title,
        date: bookmark_post.publishedDate,
        excerpt: bookmark_post.contentSnippet
      });
    }

    window.localStorage.TrumpMEMES_feed_bookmarks = JSON.stringify(user_bookmarks);
    $rootScope.$broadcast("new-bookmark");
  };

  this.bookmarkWordpressPost = function(bookmark_post) {

    var user_bookmarks = !_.isUndefined(window.localStorage.TrumpMEMES_wordpress_bookmarks) ?
      JSON.parse(window.localStorage.TrumpMEMES_wordpress_bookmarks) : [];

    //check if this post is already saved

    var existing_post = _.find(user_bookmarks, function(post) {
      return post.id == bookmark_post.id;
    });

    if (!existing_post) {
      user_bookmarks.push({
        id: bookmark_post.id,
        title: bookmark_post.title,
        date: bookmark_post.date,
        excerpt: bookmark_post.excerpt
      });
    }

    window.localStorage.TrumpMEMES_wordpress_bookmarks = JSON.stringify(user_bookmarks);
    $rootScope.$broadcast("new-bookmark");
  };

  this.getBookmarks = function() {
    return {
      feeds: JSON.parse(window.localStorage.TrumpMEMES_feed_bookmarks || '[]'),
      wordpress: JSON.parse(window.localStorage.TrumpMEMES_wordpress_bookmarks || '[]')
    };
  };
})


// WP POSTS RELATED FUNCTIONS
.service('PostService', function($rootScope, $http, $q, WORDPRESS_API_URL) {

  this.getRecentPosts = function(page) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_recent_posts/' +
        '?page=' + page +
        '&callback=JSON_CALLBACK')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data) {
        deferred.reject(data);
      });

    return deferred.promise;
  };


  this.getPost = function(postId) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_post/' +
        '?post_id=' + postId +
        '&callback=JSON_CALLBACK')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data) {
        deferred.reject(data);
      });

    return deferred.promise;
  };

  this.shortenPosts = function(posts) {
    //we will shorten the post
    //define the max length (characters) of your post content
    var maxLength = 500;
    return _.map(posts, function(post) {
      if (post.content.length > maxLength) {
        //trim the string to the maximum length
        var trimmedString = post.content.substr(0, maxLength);
        //re-trim if we are in the middle of a word
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
        post.content = trimmedString;
      }
      return post;
    });
  };

  this.sharePost = function(link) {
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };

})

// IMGUR RELATED FUNCTIONS
.service('ImgurService', function($rootScope, $http, $q, IMGUR_SEARCH_URL, IMGUR_SEARCH_IMG_URL, AWS_IDETITYPOOLID, AWS_ROLEARN, AWS_DYNAMODB_REGION) {

    this.getRecentPosts = function(page, clientId) {
      var deferred = $q.defer();
      var ext = this.getExtension();
      var randPg = this.getRandPg(page);

      var url = IMGUR_SEARCH_URL + page + '/?q=title:+trump+ext:' + ext;
      $http({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': 'Client-ID ' + clientId
          },
          timeout: 30000,
          cache: false
        })
        .success(function(results) {
          //console.log('result.data ' + JSON.stringify(results.data));
          deferred.resolve(results.data);
        })
        .error(function(results) {
          console.log('error ' + JSON.stringify(results));
          deferred.reject(results);
        });

      return deferred.promise;
    };

    //RANDOMIZE SEARCH
    this.getExtension = function() {
      var r = Math.floor(Math.random() * 3) + 1;
      if (r == 1) {
        return "jpeg";
      } else if (r == 2) {
        return "png";
      } else if (r == 3) {
        return "gif";
      }

    };

    this.getRandPg = function(page) {
      return Math.floor(Math.random() * page) + 1;
    };

    //AWS
    this.getImgurClientId = function(callback) {
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_IDETITYPOOLID,
        // optional, only necessary when the identity pool is not configured
        // to use IAM roles in the Amazon Cognito Console
        RoleArn: AWS_ROLEARN
      });

      console.log('AWS.config.credentials ' + AWS.config.credentials);

      AWS.config.update({
        region: AWS_DYNAMODB_REGION
      });

      var dynamodb = new AWS.DynamoDB();

      //console.log(dynamodb);

      var params = {
        AttributesToGet: [
          "ClientId"
        ],
        TableName: 'ServiceProvider',
        Key: {
          "ProviderName": {
            "S": "Imgur"
          }
        }
      };

      dynamodb.getItem(params, function(err, data) {
        if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          callback(err);
        } else {
          console.log("Query succeeded. " + JSON.stringify(data, null, 2));
          callback(data);

        }
      });

    };
  })
  //end svc

// REDDIT RELATED FUNCTIONS
.service('RedditService', function($rootScope, $http, $q, REDDIT_SEARCH_URL, AWS_IDETITYPOOLID, AWS_ROLEARN, AWS_DYNAMODB_REGION, REDDIT_OAUTH2_URL) {

  this.getRecentPosts = function(afterId, accessToken) {
    var deferred = $q.defer();
    //console.log('in service afterId ' + afterId);

    var url = REDDIT_SEARCH_URL;
    var afterStr = '';
    if (afterId != 'initialAfterId') {
      afterStr = '&limit=100&after=' + afterId + '/';
      //console.log('afterStr ' + afterStr);
      url = url + afterStr;
    }
    //console.log('accessToken ' + accessToken);

    $http({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + accessToken,
          'User-Agent': 'ios:com.kraftwerking.TrumpMEME:v1.0.0'
        },
        timeout: 30000,
        cache: false
      })
      .success(function(results) {
        //console.log('results.data.children ' + JSON.stringify(results.data.children));
        deferred.resolve(results.data.children);
      })
      .error(function(results) {
        console.log('error ' + JSON.stringify(results));
        deferred.reject(results);
      });

    return deferred.promise;
  };

  //AWS
  this.getRedditClientId = function(callback) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_IDETITYPOOLID,
      // optional, only necessary when the identity pool is not configured
      // to use IAM roles in the Amazon Cognito Console
      RoleArn: AWS_ROLEARN
    });

    console.log('AWS.config.credentials ' + AWS.config.credentials);

    AWS.config.update({
      region: AWS_DYNAMODB_REGION
    });

    var dynamodb = new AWS.DynamoDB();

    //console.log(dynamodb);

    var params = {
      AttributesToGet: [
        "ClientId",
        "Secret"
      ],
      TableName: 'ServiceProvider',
      Key: {
        "ProviderName": {
          "S": "Reddit"
        }
      }
    };

    dynamodb.getItem(params, function(err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        callback(err);
      } else {
        console.log("Query succeeded. " + JSON.stringify(data, null, 2));
        callback(data);

      }
    });

  };


  this.getRedditAccessToken = function(clientId, secret) {
    console.log('this.getRedditAccessToken clientId ' + clientId);
    var deferred = $q.defer();
    var basicAuthStr = clientId + ':';
    console.log('basicAuthStr ' + basicAuthStr);
    var basicAuth = btoa(basicAuthStr);
    console.log('basicAuth ' + basicAuth);
    var authBasic = atob(secret);
    console.log('authBasic ' + authBasic);
    $http({
        method: "POST",
        url: REDDIT_OAUTH2_URL,
        data: "grant_type=https://oauth.reddit.com/grants/installed_client&device_id=DO_NOT_TRACK_THIS_DEVICE",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + basicAuth
        },
        cache: true,
        timeout: 10000
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        accessToken = response;
        console.log("success " + JSON.stringify(response));
        deferred.resolve(response);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("error " + JSON.stringify(response));
        deferred.reject(response);
      });
    return deferred.promise;
  };

})

// IMAGE RELATED FUNCTIONS
.service('ImageService', function($ionicLoading) {

  //CREATE IMG AS JSON OBJECT
  this.getImg = function(imgTitle, imgLink, imgSource) {
    console.log(imgTitle);
    img = {};
    img.imgTitle = imgTitle;
    img.imgLink = imgLink;
    img.imgSource = imgSource;

    console.log('img ' + JSON.stringify(img));
    return img;
  };

})

// GIPHY RELATED FUNCTIONS
.service('GiphyService', function($rootScope, $http, $q, AWS_IDETITYPOOLID, AWS_ROLEARN, AWS_DYNAMODB_REGION, GIPHY_SEARCH_URL) {

  //AWS
  this.getGiphyApiKey = function(callback) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_IDETITYPOOLID,
      // optional, only necessary when the identity pool is not configured
      // to use IAM roles in the Amazon Cognito Console
      RoleArn: AWS_ROLEARN
    });

    console.log('AWS.config.credentials ' + AWS.config.credentials);

    AWS.config.update({
      region: AWS_DYNAMODB_REGION
    });

    var dynamodb = new AWS.DynamoDB();

    var params = {
      AttributesToGet: [
        "ApiKey"
      ],
      TableName: 'ServiceProvider',
      Key: {
        "ProviderName": {
          "S": "Giphy"
        }
      }
    };

    dynamodb.getItem(params, function(err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        callback(err);
      } else {
        console.log("Query succeeded. " + JSON.stringify(data, null, 2));
        callback(data);

      }
    });

  };

  this.getRecentPosts = function(offset, giphyApiKey) {
    var deferred = $q.defer();
    //console.log('in service afterId ' + afterId);

    var url = GIPHY_SEARCH_URL;
    var offsetStr = '';
    var apiStr = '&api_key=' + giphyApiKey;
    if (offset !== 0) {
      offsetStr = '&offset=' + offset;
      console.log('offsetStr ' + offsetStr);
    }
    url = url + offsetStr + apiStr;
    console.log('url ' + url);

    $http({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
        cache: false
      })
      .success(function(results) {
        //console.log('results.data.children ' + JSON.stringify(results.data.children));
        //prepare slugs
        for (var i = 0; i < results.data.length; i++) {
          var obj = results.data[i];
          var slugStr = obj.slug.split("-").join(" ");
          var lastIndex = slugStr.lastIndexOf(" ");
          slugStr = slugStr.substring(0, lastIndex);
          //console.log(slugStr);
          results.data[i].slug = slugStr;
        }

        deferred.resolve(results.data);
      })
      .error(function(results) {
        console.log('error ' + JSON.stringify(results));
        deferred.reject(results);
      });

    return deferred.promise;
  };

});
