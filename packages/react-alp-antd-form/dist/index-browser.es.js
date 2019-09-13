import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Form } from 'antd';
import { Field } from 'react-final-form';
import React from 'react';

function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id"]);

  return React.createElement(Form.Item, {
    htmlFor: id,
    label: label
  }, React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      var input = _ref2.input,
          meta = _ref2.meta,
          rest = _objectWithoutPropertiesLoose(_ref2, ["input", "meta"]);

      return React.createElement(Component, Object.assign({}, input, rest));
    }
  }, props)));
}

export { FormField };
//# sourceMappingURL=index-browser.es.js.map
