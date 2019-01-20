import AuthenticationService from './services/authentification/AuthenticationService';
export default function createAuthController({ usersManager, authenticationService, homeRouterKey, }: {
    authenticationService: AuthenticationService;
    homeRouterKey?: string;
    usersManager: any;
}): {
    login(ctx: any): Promise<void>;
    loginResponse(ctx: any): Promise<void>;
    logout(ctx: any): Promise<void>;
};
//# sourceMappingURL=createAuthController.d.ts.map