<h3 align="center">
  react-alp-auth
</h3>

<p align="center">
  react alp context
</p>

<p align="center">
  <a href="https://npmjs.org/package/react-alp-auth"><img src="https://img.shields.io/npm/v/react-alp-auth.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-alp-auth"><img src="https://img.shields.io/npm/dw/react-alp-auth.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-alp-auth"><img src="https://img.shields.io/node/v/react-alp-auth.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-alp-auth"><img src="https://img.shields.io/npm/types/react-alp-auth.svg?style=flat-square"></a>
</p>

## Install

```sh
npm install --save react-alp-auth
```

```tsx
import { useLoggedInUserState } fromm 'react-alp-auth';

function SomeComponent() {
  const { isLoggedIn } = useLoggedInUserState();

  return isLoggedIn ? 'logged in' : 'not logged in';
}
```
