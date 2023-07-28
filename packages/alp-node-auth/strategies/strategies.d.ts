import { Config, SlackParams } from 'alp-types';
import { ClientCredentials, AuthorizationCode } from 'simple-oauth2';

export interface Strategy<Params = SlackParams> {
  type: 'oauth2';
  oauth2: {
    authorizationCode: AuthorizationCode<Params>;
    clientCredentials: ClientCredentials<Params>;
  };
}

export default function createStrategy<Params = SlackParams>(
  config: Config,
): Strategy<Params>;
