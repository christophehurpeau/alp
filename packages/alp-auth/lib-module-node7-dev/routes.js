/* eslint no-template-curly-in-string: 'off' */

export default {
  login: ['/login[/${strategy}]', segment => {
    segment.add('loginResponse', '/response', 'auth.loginResponse').defaultRoute('login', 'auth.login');
  }],
  logout: ['logout', '/logout', 'auth.logout']
};
//# sourceMappingURL=routes.js.map