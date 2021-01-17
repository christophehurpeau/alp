import React from 'react';
import { Route } from 'react-router';
import { Transition } from 'react-transition-group';

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
//# sourceMappingURL=index-node12-dev.mjs.map
