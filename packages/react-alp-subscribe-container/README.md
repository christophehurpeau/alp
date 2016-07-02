# react-alp-subscribe-container [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

react container to subscribe on mount and unsubscribe on unmount on an event in websocket

example: `myname` will emit `subscribe:myname` and `unsubscribe:myname`.

`subscribe:myname`'s callback can return an action.

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
[daviddm-image]: https://david-dm.org/alpjs/react-alp-subscribe-container.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alpjs/react-alp-subscribe-container
