import { create } from 'simple-oauth2';

export default function dropboxStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
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
}
