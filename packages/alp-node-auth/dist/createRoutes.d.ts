import { AuthController } from './createAuthController';
export interface AuthRoutes {
    login: [string, (segment: any) => void];
    addScope: [string, AuthController['addScope']];
    logout: [string, AuthController['logout']];
}
export declare const createRoutes: (controller: AuthController) => AuthRoutes;
//# sourceMappingURL=createRoutes.d.ts.map