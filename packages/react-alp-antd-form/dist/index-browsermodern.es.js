import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Form } from 'antd';
import { Field } from 'react-final-form';
import React from 'react';

function FormField(_ref) {
  let {
    component: Component,
    label,
    name,
    id = name,
    help
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id", "help"]);

  return React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      let {
        input
      } = _ref2,
          rest = _objectWithoutPropertiesLoose(_ref2, ["input", "meta"]);

      return React.createElement(Component, Object.assign({}, input, rest));
    }
  }, props)));
}

export { FormField };
//# sourceMappingURL=index-browsermodern.es.js.map
