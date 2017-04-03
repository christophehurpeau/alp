# react-alp-subscribe-container [![NPM version][npm-image]][npm-url]

react subscribe-container, works with alp-websocket

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```sh
npm install --save react-alp-subscribe-container
```

## Usage

```js
import SubscribeContainer from 'react-alp-subscribe-container';

export function MyComponent({ dispatch }) {
    return (<SubscribeContainer dispatch={dispatch} name="myname">
        <div>
        </div>
    </SubscribeContainer>)
}
```

[npm-image]: https://img.shields.io/npm/v/react-alp-subscribe-container.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-alp-subscribe-container
[daviddm-image]: https://david-dm.org/alpjs/react-alp-subscribe-container.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/react-alp-subscribe-container
[dependencyci-image]: https://dependencyci.com/github/alpjs/react-alp-subscribe-container/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/react-alp-subscribe-container
