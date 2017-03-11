angular.module('TrumpMEME.config', [])
.constant('WORDPRESS_API_URL', 'http://wordpress.kraftwerking.com/blog/api/')
.constant('GCM_SENDER_ID', '574597432927')
.constant('IMGUR_SEARCH_URL', 'https://api.imgur.com/3/gallery/search/viral/')
.constant('IMGUR_SEARCH_IMG_URL', 'https://api.imgur.com/3/gallery/image/')
.constant('AWS_IDETITYPOOLID', 'us-east-1:ef4a858c-214b-4136-a195-9d99a450edb1')
.constant('AWS_ROLEARN', 'arn:aws:iam::990751061169:role/Cognito_kraftwerkingidentitypoolUnauth_Role')
.constant('AWS_DYNAMODB_REGION', 'us-east-1')
.constant('MSG_TAG', 'Sent via the TrumpMEMES mobile app')
.constant('REDDIT_SEARCH_URL', 'https://oauth.reddit.com/r/memes/search/.json?q=trump&restrict_sr=on&t=all')
.constant('REDDIT_OAUTH2_URL', 'https://www.reddit.com/api/v1/access_token')
.constant('GIPHY_SEARCH_URL', 'http://api.giphy.com/v1/gifs/search?q=trump&limit=100')

;
