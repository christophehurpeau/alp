import { create } from 'simple-oauth2';

export default function githubStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
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
}
