import AuthenticationService from './services/authentification/AuthenticationService';
import MongoUsersManager from './MongoUsersManager';
export interface CreateAuthControllerParams {
    authenticationService: AuthenticationService;
    homeRouterKey?: string;
    usersManager: MongoUsersManager;
}
export interface AuthController {
    login(ctx: any): Promise<void>;
    loginResponse(ctx: any): Promise<void>;
    logout(ctx: any): Promise<void>;
}
export declare function createAuthController({ usersManager, authenticationService, homeRouterKey, }: CreateAuthControllerParams): AuthController;
//# sourceMappingURL=createAuthController.d.ts.map