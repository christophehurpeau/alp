import { ClientCredentials, AuthorizationCode } from 'simple-oauth2';
export type GoogleParams =
  | 'access_type'
  | 'include_granted_scopes'
  | 'login_hint'
  | 'prompt';
export type SlackParams = 'client_id' | 'team';

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
