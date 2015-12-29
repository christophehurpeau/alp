'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rootReducer = (0, _redux.combineReducers)({
    name: _name2.default
});

exports.default = rootReducer;
//# sourceMappingURL=index.js.map
