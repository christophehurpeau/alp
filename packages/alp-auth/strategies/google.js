const oauth2 = require('simple-oauth2');

module.exports = function googleStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('google').get('clientId'),
            clientSecret: config.get('google').get('clientSecret'),
            site: 'https://accounts.google.com',
            authorizationPath: '/o/oauth2/auth',
            tokenPath: '/o/oauth2/token',
        }),
    };
}
