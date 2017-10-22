var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component, Node as _Node } from 'react';

import t from 'flow-runtime';
var Node = t.tdz(function () {
  return _Node;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node))));
var AlpModule = (_temp = _class = function (_Component) {
  _inherits(AlpModule, _Component);

  function AlpModule() {
    _classCallCheck(this, AlpModule);

    return _possibleConstructorReturn(this, (AlpModule.__proto__ || Object.getPrototypeOf(AlpModule)).apply(this, arguments));
  }

  _createClass(AlpModule, [{
    key: 'render',
    value: function render() {
      var _returnType = t.return(t.ref(Node));

      if (this.props.reducers) {
        throw new Error('You have reducers, probably want to use AlpReduxModule.');
      }

      return _returnType.assert(this.props.children);
    }
  }]);

  return AlpModule;
}(Component), _class.propTypes = t.propTypes(PropsType), _temp);
export { AlpModule as default };
//# sourceMappingURL=AlpModule.js.map