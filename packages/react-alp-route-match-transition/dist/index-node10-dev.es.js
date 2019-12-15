import { Route } from 'react-router';
import React from 'react';
import { Transition } from 'react-transition-group';

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
  return React.createElement(Route, {
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

    return React.createElement(Transition, {
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

export default RouteMatchTransition;
//# sourceMappingURL=index-node10-dev.es.js.map
