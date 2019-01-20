const oauth2 = require('simple-oauth2').create;

module.exports = function slackStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: oauth2({
      client: {
        id: config.get('slack').get('clientId'),
        secret: config.get('slack').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://slack.com',
        tokenPath: '/api/oauth.access',
        authorizePath: '/oauth/authorize',
      },
    }),
  };
};
