import { create } from 'simple-oauth2';

export default function googleStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
      client: {
        id: config.get('google').get('clientId'),
        secret: config.get('google').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://accounts.google.com',
        tokenPath: '/o/oauth2/token',
        authorizePath: '/o/oauth2/auth',
      },
    }),
  };
}
