import AuthenticationService from '../services/AuthenticationService';

export default function createAuthController({
    authenticationService,
    loginModuleDescriptor,
    homeRouterKey = 'home',
}: {
    authenticationService: AuthenticationService,
    loginModuleDescriptor: Object,
    homeRouterKey: ?string,
}) {
    return {
        async login(ctx) {
            if (ctx.state.connected) {
                ctx.redirect(ctx.urlGenerator(homeRouterKey));
            }

            const strategy = ctx.namedParam('strategy');
            if (strategy) {
                await authenticationService.redirectAuthUrl(ctx, strategy);
                return;
            }

            await ctx.render(loginModuleDescriptor);
        },

        async loginResponse(ctx) {
            if (ctx.state.connected) {
                ctx.redirect(ctx.urlGenerator(homeRouterKey));
            }

            const strategy = ctx.namedParam('strategy');
            ctx.assert(strategy);

            const connectedUser = await authenticationService.accessResponse(ctx, strategy);
            await ctx.setConnected(connectedUser._id, connectedUser);
            ctx.state.connected = connectedUser;
            await ctx.redirect(ctx.urlGenerator(homeRouterKey));
        },
    };
}
