var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global PRODUCTION */

function uneval(obj, keys) {
  var objects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

  switch (obj) {
    case null:
      return 'null';
    case undefined:
      return 'undefined';
    case Infinity:
      return 'Infinity';
    case -Infinity:
      return '-Infinity';
  }

  if (Number.isNaN(obj)) {
    return 'NaN';
  }

  switch (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) {
    case 'function':
      throw new Error(false);
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(obj);
  }

  if (objects.has(obj)) {
    throw new Error(false);
  }

  objects.add(obj);

  // specialized types
  if (obj instanceof Array) {
    return '[' + obj.map(function (o, index) {
      return uneval(o, false, objects);
    }).join(',') + ']';
  }

  if (obj instanceof Date) {
    return 'new Date(' + obj.getTime() + ')';
  }

  if (obj instanceof Set) {
    return 'new Set(' + uneval(Array.from(obj), keys) + ')';
  }

  if (obj instanceof Map) {
    return 'new Map(' + uneval(Array.from(obj), keys) + ')';
  }

  return '{' + Object.keys(obj).map(function (key) {
    return JSON.stringify(key) + ':' + uneval(obj[key], false);
  }).join(',') + '}';
}

// https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw
var UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;
var ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

var escapeUnsafeChars = function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
};

export default (function (obj) {
  return uneval(obj, 'obj').replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
});
//# sourceMappingURL=uneval.js.map