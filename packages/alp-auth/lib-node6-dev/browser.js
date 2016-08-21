'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.routes = undefined;

var _routes = require('./routes');

Object.defineProperty(exports, 'routes', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_routes).default;
    }
});
exports.default = init;

var _createAuthController = require('./controllers/createAuthController.browser');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(_ref) {
    let controllers = _ref.controllers;
    let loginModuleDescriptor = _ref.loginModuleDescriptor;
    let homeRouterKey = _ref.homeRouterKey;

    if (!(arguments[0] != null && arguments[0].controllers instanceof Map && arguments[0].loginModuleDescriptor instanceof Object && (arguments[0].homeRouterKey == null || typeof arguments[0].homeRouterKey === 'string'))) {
        throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{\n  controllers: Map;\n  loginModuleDescriptor: Object;\n  homeRouterKey: ?string;\n}\n\nGot:\n' + _inspect(arguments[0]));
    }

    return app => {
        controllers.set('auth', (0, _createAuthController2.default)({
            loginModuleDescriptor,
            homeRouterKey
        }));
    };
}

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=browser.js.map