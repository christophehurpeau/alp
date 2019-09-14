'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose'));
var reactRouter = require('react-router');
var React = _interopDefault(require('react'));
var reactTransitionGroup = require('react-transition-group');

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-route-match-transition/src/index.tsx";

function RouteMatchTransition(_ref2) {
  var path = _ref2.path,
      closePath = _ref2.closePath,
      timeout = _ref2.timeout,
      Component = _ref2.component,
      _ref2$wrapperComponen = _ref2.wrapperComponent,
      otherProps = _objectWithoutPropertiesLoose(_ref2, ["path", "closePath", "timeout", "component", "wrapperComponent"]);

  return React.createElement(reactRouter.Route, {
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

    return React.createElement(reactTransitionGroup.Transition, {
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

exports.default = RouteMatchTransition;
//# sourceMappingURL=index-browser-dev.cjs.js.map
