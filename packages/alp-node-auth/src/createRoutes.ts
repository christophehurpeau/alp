import { AuthController } from './createAuthController';

export interface AuthRoutes {
  login: [string, (segment: any) => void];
  logout: [string, AuthController['logout']];
}

export const createRoutes = (controller: AuthController): AuthRoutes => ({
  login: [
    '/login/:strategy',
    (segment: any) => {
      segment.add('/response', controller.loginResponse, 'loginResponse');
      segment.defaultRoute(controller.login, 'login');
    },
  ],
  logout: ['/logout', controller.logout],
});
