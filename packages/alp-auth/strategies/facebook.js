const oauth2 = require('simple-oauth2');

module.exports = function facebookStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('facebook').get('clientId'),
            clientSecret: config.get('facebook').get('clientSecret'),
            site: 'https://www.facebook.com',
            authorizationPath: '/dialog/oauth',
            tokenPath: '/oauth/access_token',
        }),
    };
};
