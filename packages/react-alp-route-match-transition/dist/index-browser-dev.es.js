import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Route } from 'react-router';
import React from 'react';
import { Transition } from 'react-transition-group';

var _jsxFileName = "/home/chris/libs/alp/packages/react-alp-route-match-transition/src/index.tsx";

function RouteMatchTransition(_ref2) {
  var path = _ref2.path,
      closePath = _ref2.closePath,
      timeout = _ref2.timeout,
      Component = _ref2.component,
      _ref2$wrapperComponen = _ref2.wrapperComponent,
      otherProps = _objectWithoutPropertiesLoose(_ref2, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

  return React.createElement(Route, {
    path: path,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, function (_ref3) {
    var match = _ref3.match,
        history = _ref3.history;

    var handleClose = function handleClose() {
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
//# sourceMappingURL=index-browser-dev.es.js.map
