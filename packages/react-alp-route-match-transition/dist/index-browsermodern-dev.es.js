import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Route } from 'react-router';
import React from 'react';
import { Transition } from 'react-transition-group';

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

  return /*#__PURE__*/React.createElement(Route, {
    path: path
  }, function ({
    match,
    history
  }) {
    const handleClose = function handleClose() {
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
//# sourceMappingURL=index-browsermodern-dev.es.js.map
