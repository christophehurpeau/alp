const oauth2 = require('simple-oauth2').create;

module.exports = function dropboxStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: oauth2({
      client: {
        id: config.get('dropbox').get('clientId'),
        secret: config.get('dropbox').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://www.dropbox.com',
        tokenPath: '/1/oauth2/token',
        authorizePath: '/1/oauth2/authorize',
      },
    }),
  };
};
