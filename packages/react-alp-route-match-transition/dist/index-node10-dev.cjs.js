'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const reactRouter = require('react-router');
const React = _interopDefault(require('react'));
const reactTransitionGroup = require('react-transition-group');

var _jsxFileName = "/home/chris/libs/alp/packages/react-alp-route-match-transition/src/index.tsx";

const DefaultWrapperComponent = ({
  children,
  visible
}) => children;

function RouteMatchTransition({
  path,
  closePath,
  timeout,
  component: Component,
  wrapperComponent: WrapperComponent = DefaultWrapperComponent,
  ...otherProps
}) {
  return React.createElement(reactRouter.Route, {
    path: path,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, ({
    match,
    history
  }) => {
    const handleClose = () => {
      history.push(closePath);
    };

    return React.createElement(reactTransitionGroup.Transition, {
      exit: true,
      enter: false,
      in: Boolean(match !== null),
      timeout: timeout,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62
      },
      __self: this
    }, state => {
      switch (state) {
        case 'entering':
        case 'entered':
        case 'exiting':
          return React.createElement(Component, Object.assign({
            match: match,
            exiting: state === 'exiting',
            onClose: handleClose
          }, otherProps, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 74
            },
            __self: this
          }));

        case 'exited':
        case 'unmounted':
          return null;
      }
    });
  });
}

exports.default = RouteMatchTransition;
//# sourceMappingURL=index-node10-dev.cjs.js.map
