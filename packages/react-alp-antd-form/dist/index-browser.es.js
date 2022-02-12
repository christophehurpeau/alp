import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Form } from 'antd';
import { Field } from 'react-final-form';
import { jsx } from 'react/jsx-runtime.js';

var _excluded = ["component", "label", "name", "id", "help"],
    _excluded2 = ["input", "meta"];
function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      help = _ref.help,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  return /*#__PURE__*/jsx(Form.Item, {
    htmlFor: id,
    label: label,
    help: help,
    children: /*#__PURE__*/jsx(Field, _extends({
      id: id,
      name: name,
      render: function render(_ref2) {
        var input = _ref2.input;
            _ref2.meta;
            var rest = _objectWithoutPropertiesLoose(_ref2, _excluded2);

        return /*#__PURE__*/jsx(Component, _extends({}, input, rest));
      }
    }, props))
  });
}

export { FormField };
//# sourceMappingURL=index-browser.es.js.map
