'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');
const reactRouter = require('react-router');
const reactTransitionGroup = require('react-transition-group');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  return /*#__PURE__*/React__default.createElement(reactRouter.Route, {
    path: path
  }, ({
    match,
    history
  }) => {
    const handleClose = () => {
      history.push(closePath);
    };

    return /*#__PURE__*/React__default.createElement(reactTransitionGroup.Transition, {
      exit: true,
      enter: false,
      in: Boolean(match !== null),
      timeout: timeout
    }, state => {
      switch (state) {
        case 'entering':
        case 'entered':
        case 'exiting':
          return /*#__PURE__*/React__default.createElement(Component, Object.assign({
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
//# sourceMappingURL=index-node12-dev.cjs.js.map
