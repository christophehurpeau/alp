'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const reactRouter = require('react-router');
const React = _interopDefault(require('react'));
const reactTransitionGroup = require('react-transition-group');

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
    path: path
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
      timeout: timeout
    }, state => {
      switch (state) {
        case 'entering':
        case 'entered':
        case 'exiting':
          return React.createElement(Component, Object.assign({
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

exports.default = RouteMatchTransition;
//# sourceMappingURL=index-node10.cjs.js.map
