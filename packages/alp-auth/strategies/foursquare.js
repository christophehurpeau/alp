const oauth2 = require('simple-oauth2');

module.exports = function foursquareStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('foursquare').get('clientId'),
            clientSecret: config.get('foursquare').get('clientSecret'),
            site: 'https://foursquare.com',
            authorizationPath: '/oauth2/authenticate',
            tokenPath: '/oauth2/access_token',
        }),
    };
};
