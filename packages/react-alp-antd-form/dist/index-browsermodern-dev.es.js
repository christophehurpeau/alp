import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Form } from 'antd';
import { Field } from 'react-final-form';
import React from 'react';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-antd-form/src/FormField.tsx";
function FormField(_ref) {
  let {
    component: Component,
    label,
    name,
    id = name
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id"]);

  return React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      let {
        input
      } = _ref2,
          rest = _objectWithoutPropertiesLoose(_ref2, ["input", "meta"]);

      return React.createElement(Component, Object.assign({}, input, rest, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        },
        __self: this
      }));
    }
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  })));
}

export { FormField };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
