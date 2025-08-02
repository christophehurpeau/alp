<h1 align="center">
  alp-node-auth
</h1>

<p align="center">
  authentication with alp
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node-auth"><img src="https://img.shields.io/npm/v/alp-node-auth.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.org/package/alp-node-auth"><img src="https://img.shields.io/npm/dw/alp-node-auth.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.org/package/alp-node-auth"><img src="https://img.shields.io/node/v/alp-node-auth.svg?style=flat-square" alt="node version"></a>
  <a href="https://npmjs.org/package/alp-node-auth"><img src="https://img.shields.io/npm/types/alp-node-auth.svg?style=flat-square" alt="types"></a>
</p>

## Install

```sh
npm install --save alp-node-auth
```

## What it does

- Provides route and controller to login user
- Provides extandable services and managers
- Provides authentication middleware: `context.state.loggedInUserId` and `context.state.loggedInUser`

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
import MongoStore from "../../db/mongo";
import { UsersManager } from "alp-node-auth";

export default new UsersManager(new MongoStore("users"));
```

> index.server.js

```js
import Alp from 'alp-node';
import authInit from 'alp-node-auth';
import googleStrategy from 'alp-node-auth/strategies/google';
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
import { routes as authRoutes } from "alp-node-auth";

export default function buildRouter(builder) {
  builder
    .add("home", "/", "home.index")
    .add(...authRoutes.login)
    .add(...authRoutes.logout)
    .addDefaultRoutes();
}
```

> modules/auth/login/index.js

```js
export const identifier = "login";
export View from "./LoginView";
```

> modules/auth/login/LoginView.js

```js
import { ReactNode } from 'react';
import { LoginButtons } from 'react-alp-login';
import Header from '../components/HeaderComponent';

export default (): ReactNode => (
  <div className="login-view">
    <Helmet title="Login" titleTemplate={`${title} - %s`} />
    <Header />
    <LoginButtons />
  </div>
);
```

> modules/common/components/HeaderUserComponent.js

```js
import { ReactNode } from 'react';
import Link from 'react-alp-link';
import User from 'react-alp-user';

  <User>
    {user => (
      user ? (
        <span className="dropdown">
          {user.displayName}
          <ul className="list links">
            <li>
              <Link to="logout" target="_self">Logout</Link>
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
