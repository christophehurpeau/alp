const oauth2 = require('simple-oauth2');

module.exports = function dropboxStrategy(config) {
    return {
        type: 'oauth2',
        oauth2: oauth2({
            clientID: config.get('dropbox').get('clientId'),
            clientSecret: config.get('dropbox').get('clientSecret'),
            site: 'https://www.dropbox.com',
            authorizationPath: '/1/oauth2/authorize',
            tokenPath: '/1/oauth2/token',
        }),
    };
};
