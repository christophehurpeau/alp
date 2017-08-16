'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global PRODUCTION */

function uneval(obj, keys, objects = new Set()) {
  switch (obj) {
    case null:
      return 'null';
    case void 0:
      return 'undefined';
    case Infinity:
      return 'Infinity';
    case -Infinity:
      return '-Infinity';
  }

  if (Number.isNaN(obj)) return 'NaN';

  switch (typeof obj) {
    case 'function':
      throw console.log(obj), new Error(`Unsupported function "${keys}".`);
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(obj);
  }

  if (objects.has(obj)) throw new Error('Circular reference detected.');

  // specialized types
  return objects.add(obj), obj instanceof Array ? `[${obj.map((o, index) => uneval(o, `${keys}[${index}]`, objects)).join(',')}]` : obj instanceof Date ? `new Date(${obj.getTime()})` : obj instanceof Set ? `new Set(${uneval(Array.from(obj), keys)})` : obj instanceof Map ? `new Map(${uneval(Array.from(obj), keys)})` : `{${Object.keys(obj).map(key => `${JSON.stringify(key)}:${uneval(obj[key], `${keys}.${key}`)}`).join(',')}}`;
}

// https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw
const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

const escapeUnsafeChars = unsafeChar => ESCAPED_CHARS[unsafeChar];

exports.default = function uneval0(obj) {
  return uneval(obj, 'obj').replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
};
//# sourceMappingURL=uneval.js.map