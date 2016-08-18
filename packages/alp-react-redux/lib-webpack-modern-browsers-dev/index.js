import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };
import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };
import _createLoader from './createLoader';
export { _createLoader as createLoader };


var logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 38 }, { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 }];

export default function alpReactRedux(Html) {
  return app => {
    if (!(app instanceof Object)) {
      throw new TypeError('Value of argument "app" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(undefined, data).then(data => {
          return this.render(moduleDescriptor, data, true);
        });
      }

      if (moduleDescriptor.reducer) {
        this.store = createStore(moduleDescriptor.reducer, data);
      }

      this.body = render({
        htmlData: {
          context: this,
          moduleDescriptor,
          get scriptName() {
            // TODO create alp-useragent with getter in context
            var ua = this.context.req.headers['user-agent'];

            if (!(agents && (typeof agents[Symbol.iterator] === 'function' || Array.isArray(agents)))) {
              throw new TypeError('Expected agents to be iterable, got ' + _inspect(agents));
            }

            for (var agent of agents) {
              var res = agent.regexp.exec(ua);
              if (res && res[1] >= agent.modernMinVersion) {
                return 'modern-browsers';
              }
            }
            return 'es5';
          },
          initialContextState: this.computeInitialStateForBrowser()
        },
        context: this,
        View: moduleDescriptor.View,
        data: moduleDescriptor.reducer ? undefined : data,
        initialData: moduleDescriptor.reducer ? () => {
          return this.store.getState();
        } : () => {
          return null;
        },
        Html,
        App: moduleDescriptor.reducer ? ReduxApp : DefaultApp
      });
    };
  };
}

export function emitAction(to, action) {
  to.emit('redux:action', action);
}

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

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
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(item => _inspect(item, depth) === first)) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(key => {
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
//# sourceMappingURL=index.js.map