'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose');
var React = require('react');
var reactRouter = require('react-router');
var reactTransitionGroup = require('react-transition-group');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _objectWithoutPropertiesLoose__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutPropertiesLoose);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function RouteMatchTransition(_ref) {
  let path = _ref.path,
      closePath = _ref.closePath,
      timeout = _ref.timeout,
      Component = _ref.component,
      _ref$wrapperComponent = _ref.wrapperComponent,
      otherProps = _objectWithoutPropertiesLoose__default(_ref, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

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
//# sourceMappingURL=index-browser-dev.cjs.js.map
