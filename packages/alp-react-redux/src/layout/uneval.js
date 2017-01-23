/* global PRODUCTION */

function uneval(obj, objects = new Set()) {
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

  switch (typeof obj) {
    case 'function':
      if (!PRODUCTION) console.log(obj);
      throw new Error(!PRODUCTION && 'Unsupported function.');
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(obj);
  }

  if (objects.has(obj)) {
    throw new Error(!PRODUCTION && 'Circular reference detected.');
  }

  objects.add(obj);

    // specialized types
  if (obj instanceof Array) {
    return `[${obj.map(o => uneval(o, objects)).join(',')}]`;
  }

  if (obj instanceof Date) {
    return `new Date(${obj.getTime()})`;
  }

  if (obj instanceof Set) {
    return `new Set(${uneval(Array.from(obj))})`;
  }

  if (obj instanceof Map) {
    return `new Map(${uneval(Array.from(obj))})`;
  }

  return `{${Object.keys(obj).map(key => `${JSON.stringify(key)}:${uneval(obj[key])}`).join(',')}}`;
}

// https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw
const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const escapeUnsafeChars = (unsafeChar) => ESCAPED_CHARS[unsafeChar];

export default (obj) => (
  uneval(obj).replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars)
);
