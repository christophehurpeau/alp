import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Form } from 'antd';
import React from 'react';
import { Field } from 'react-final-form';

function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      help = _ref.help,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id", "help"]);

  return /*#__PURE__*/React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, /*#__PURE__*/React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      var input = _ref2.input;
          _ref2.meta;
          var rest = _objectWithoutPropertiesLoose(_ref2, ["input", "meta"]);

      return /*#__PURE__*/React.createElement(Component, Object.assign({}, input, rest));
    }
  }, props)));
}

export { FormField };
//# sourceMappingURL=index-browser-dev.es.js.map
