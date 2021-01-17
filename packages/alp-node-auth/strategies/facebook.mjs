import { create } from 'simple-oauth2';

export default function facebookStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
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
}
