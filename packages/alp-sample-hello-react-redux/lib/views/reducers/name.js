'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = name;

var _name = require('../actions/name');

function name() {
    let state = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    let action = arguments[1];

    switch (action.type) {
        case _name.SET_NAME:
            return action.name;
        default:
            return state;
    }
}
//# sourceMappingURL=name.js.map
