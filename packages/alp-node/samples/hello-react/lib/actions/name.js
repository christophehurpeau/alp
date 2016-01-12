'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setName = setName;
const SET_NAME = exports.SET_NAME = 'SET_NAME';

function setName(name) {
    return {
        type: SET_NAME,
        name: name
    };
}
//# sourceMappingURL=name.js.map
