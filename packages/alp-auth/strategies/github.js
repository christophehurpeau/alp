const oauth2 = require('simple-oauth2').create;

module.exports = function githubStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: oauth2({
      client: {
        id: config.get('github').get('clientId'),
        secret: config.get('github').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
      },
    }),
  };
};
