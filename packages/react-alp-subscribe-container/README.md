<h3 align="center">
  react-alp-subscribe-container
</h3>

<p align="center">
  react subscribe-container, works with alp-websocket
</p>

<p align="center">
  <a href="https://npmjs.org/package/react-alp-subscribe-container"><img src="https://img.shields.io/npm/v/react-alp-subscribe-container.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/react-alp-subscribe-container"><img src="https://david-dm.org/alpjs/react-alp-subscribe-container.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/react-alp-subscribe-container"><img src="https://dependencyci.com/github/alpjs/react-alp-subscribe-container/badge?style=flat-square"></a>
</p>

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
