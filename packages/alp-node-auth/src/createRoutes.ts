import { AuthController } from './createAuthController';

export interface AuthRoutes {
  login: [string, (segment: any) => void];
  addScope: [string, AuthController['addScope']];
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
  addScope: ['/auth/add-scope/:strategy/:scopeKey', controller.addScope],
  logout: ['/logout', controller.logout],
});
