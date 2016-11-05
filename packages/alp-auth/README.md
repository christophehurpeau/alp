# alp-auth [![NPM version][npm-image]][npm-url]

Authentication with alp

[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```sh
npm install --save alp-auth
```

## What it does

- Provides route and controller to login user
- Provides extandable services and managers
- Provides authentication middleware: `context.state.connected` and `context.state.user`

## How to use

> config/local.yml

```yml
server:
    google:
        clientId: xxxx
        clientSecret: xxxx

```

> models/user/usersManager.server.js

```js
import MongoStore from '../../db/mongo';
import { UsersManager } from 'alp-auth';

export default new UsersManager(new MongoStore('users'));
```

> index.server.js

```js
import Alp from 'alp-node';
import 'alp-node/fetch';
import authInit from 'alp-auth';
import googleStrategy from 'alp-auth/strategies/google';
import * as loginModuleDescriptor from './modules/auth/login';
import usersManager from './models/user/usersManager.server';

const app = new Alp(...);

// config / init
const authMiddleware = authInit({
   controllers,
   usersManager,
   strategies: { google: googleStrategy(config) },
   loginModuleDescriptor,
})(app);

// middlewares
app.use(authMiddleware);
```

> routerBuilder.js

```js
import { routes as authRoutes } from 'alp-auth';

export default function buildRouter(builder) {
    builder
        .add('home', '/', 'home.index')
        .add(...authRoutes.login)
        .add(...authRoutes.logout)
        .addDefaultRoutes();
}
````

> modules/auth/login/index.js

```js
export const identifier = 'login';
export View from './LoginView';
```

> modules/auth/login/LoginView.js

```js
import type { ReactNodeType } from 'alp-react-redux/src/types';
import T from 'react-alp-translate/src';
import { Helmet } from 'alp-react-redux/src';
import { LoginButtons } from 'react-alp-login/src';
import Header from '../components/HeaderComponent';

export default (): ReactNodeType => (
  <div className="login-view">
    <T id="title">{title => <Helmet title="Login" titleTemplate={`${title} - %s`} />}</T>
    <Header />
    <LoginButtons />
  </div>
);

```

> modules/common/components/HeaderUserComponent.js

```js
import type { ReactNodeType } from 'alp-react-redux/src/types';
import Link from 'react-alp-link/src';
import User from 'react-alp-user/src';
import T from 'react-alp-translate/src';

  <User>
    {user => (
      user ? (
        <span className="dropdown">
          {user.displayName}
          <ul className="list links">
            <li>
              <T id="header.logout">{t =>
                <Link to="logout" target="_self">{t}</Link>
              }</T>
            </li>
          </ul>
        </span>
      ) : (
        <div>
          <T id="header.login">{t => (
            <Link to="login" params={{ strategy: 'google' }} target="_self">{t}</Link>
          )}</T>
        </div>
      )
    )}
  </User>
);
```


[npm-image]: https://img.shields.io/npm/v/alp-auth.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-auth
[daviddm-image]: https://david-dm.org/alpjs/alp-auth.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alpjs/alp-auth
