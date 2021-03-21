import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import React from 'react';
import { Route } from 'react-router';
import { Transition } from 'react-transition-group';

function RouteMatchTransition(_ref2) {
  var path = _ref2.path,
      closePath = _ref2.closePath,
      timeout = _ref2.timeout,
      Component = _ref2.component;
      _ref2.wrapperComponent;
      var otherProps = _objectWithoutPropertiesLoose(_ref2, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

  return /*#__PURE__*/React.createElement(Route, {
    path: path
  }, function (_ref3) {
    var match = _ref3.match,
        history = _ref3.history;

    var handleClose = function handleClose() {
      history.push(closePath);
    };

    return /*#__PURE__*/React.createElement(Transition, {
      exit: true,
      enter: false,
      in: Boolean(match !== null),
      timeout: timeout
    }, function (state) {
      switch (state) {
        case 'entering':
        case 'entered':
        case 'exiting':
          return /*#__PURE__*/React.createElement(Component, Object.assign({
            match: match,
            exiting: state === 'exiting',
            onClose: handleClose
          }, otherProps));

        case 'exited':
        case 'unmounted':
          return null;
      }
    });
  });
}

export default RouteMatchTransition;
//# sourceMappingURL=index-browser-dev.es.js.map
