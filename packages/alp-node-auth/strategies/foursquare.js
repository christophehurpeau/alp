import { create } from 'simple-oauth2';

export default function foursquareStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
      client: {
        id: config.get('foursquare').get('clientId'),
        secret: config.get('foursquare').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://foursquare.com',
        tokenPath: '/oauth2/access_token',
        authorizePath: '/oauth2/authenticate',
      },
    }),
  };
}
