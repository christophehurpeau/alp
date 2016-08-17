const oauth2 = require('simple-oauth2');

module.exports = function githubStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('github').get('clientId'),
            clientSecret: config.get('github').get('clientSecret'),
            site: 'https://slack.com',
            authorizationPath: '/login/oauth/authorize',
            tokenPath: '/login/oauth/access_token',
        }),
    };
};
