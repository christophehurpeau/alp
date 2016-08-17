const oauth2 = require('simple-oauth2');

module.exports = function slackStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('slack').get('clientId'),
            clientSecret: config.get('slack').get('clientSecret'),
            site: 'https://slack.com',
            authorizationPath: '/oauth/authorize',
            tokenPath: '/api/oauth.access',
        }),
    };
};
