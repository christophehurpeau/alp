import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import React from 'react';
import { Route } from 'react-router';
import { Transition } from 'react-transition-group';

function RouteMatchTransition(_ref) {
  let path = _ref.path,
      closePath = _ref.closePath,
      timeout = _ref.timeout,
      Component = _ref.component,
      _ref$wrapperComponent = _ref.wrapperComponent,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

  return /*#__PURE__*/React.createElement(Route, {
    path: path
  }, ({
    match,
    history
  }) => {
    const handleClose = () => {
      history.push(closePath);
    };

    return /*#__PURE__*/React.createElement(Transition, {
      exit: true,
      enter: false,
      in: Boolean(match !== null),
      timeout: timeout
    }, state => {
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
