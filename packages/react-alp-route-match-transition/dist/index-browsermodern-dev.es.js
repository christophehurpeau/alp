import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Route } from 'react-router';
import React from 'react';
import { Transition } from 'react-transition-group';

var _jsxFileName = "/home/chris/libs/alp/packages/react-alp-route-match-transition/src/index.tsx";

const DefaultWrapperComponent = function DefaultWrapperComponent({
  children,
  visible
}) {
  return children;
};

function RouteMatchTransition(_ref) {
  let {
    path,
    closePath,
    timeout,
    component: Component,
    wrapperComponent: WrapperComponent = DefaultWrapperComponent
  } = _ref,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

  return React.createElement(Route, {
    path: path,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, function ({
    match,
    history
  }) {
    const handleClose = function handleClose() {
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
    }, function (state) {
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
//# sourceMappingURL=index-browsermodern-dev.es.js.map
