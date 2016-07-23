'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    login: ['/login[/${strategy}]', segment => {
        segment.add('loginResponse', '/response', 'auth.loginResponse').defaultRoute('login', 'auth.login');
    }],
    logout: ['logout', '/logout', 'auth.logout']
};
//# sourceMappingURL=routes.js.map