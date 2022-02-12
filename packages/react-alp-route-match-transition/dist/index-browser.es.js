import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Route } from 'react-router';
import { Transition } from 'react-transition-group';
import { jsx } from 'react/jsx-runtime';

var _excluded = ["path", "closePath", "timeout", "component", "wrapperComponent"];

function RouteMatchTransition(_ref2) {
  var path = _ref2.path,
      closePath = _ref2.closePath,
      timeout = _ref2.timeout,
      Component = _ref2.component;
      _ref2.wrapperComponent;
      var otherProps = _objectWithoutPropertiesLoose(_ref2, _excluded);

  return /*#__PURE__*/jsx(Route, {
    path: path,
    children: function children(_ref3) {
      var match = _ref3.match,
          history = _ref3.history;

      var handleClose = function handleClose() {
        history.push(closePath);
      };

      return /*#__PURE__*/jsx(Transition, {
        exit: true,
        enter: false,
        "in": Boolean(match !== null),
        timeout: timeout,
        children: function children(state) {
          switch (state) {
            case 'entering':
            case 'entered':
            case 'exiting':
              return /*#__PURE__*/jsx(Component, _extends({
                match: match,
                exiting: state === 'exiting',
                onClose: handleClose
              }, otherProps));

            case 'exited':
            case 'unmounted':
              return null;
          }
        }
      });
    }
  });
}

export { RouteMatchTransition as default };
//# sourceMappingURL=index-browser.es.js.map
