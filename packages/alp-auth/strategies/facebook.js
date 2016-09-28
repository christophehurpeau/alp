const oauth2 = require('simple-oauth2').create;

module.exports = function facebookStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: oauth2({
      client: {
        id: config.get('facebook').get('clientId'),
        secret: config.get('facebook').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://www.facebook.com',
        tokenPath: '/oauth/access_token',
        authorizePath: '/dialog/oauth',
      },
    }),
  };
};
