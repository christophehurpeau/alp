/* eslint-disable complexity */

import { IS_DEV } from 'pob-babel';

function uneval(
  value: unknown,
  keys: undefined | string,
  objects = new Set(),
): string {
  switch (value) {
    case null:
      return 'null';
    case undefined:
      return 'undefined';
    case Infinity:
      return 'Infinity';
    case -Infinity:
      return '-Infinity';
  }

  if (Number.isNaN(value)) {
    return 'NaN';
  }

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (typeof value) {
    case 'function':
      if (IS_DEV) console.log(value);
      throw new Error(!IS_DEV ? undefined : `Unsupported function "${keys!}".`);
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(value);
  }

  if (objects.has(value)) {
    throw new Error(!IS_DEV ? undefined : 'Circular reference detected.');
  }

  objects.add(value);

  // specialized types
  if (Array.isArray(value)) {
    return `[${value
      .map((o, index) =>
        uneval(o, !IS_DEV ? undefined : `${keys!}[${index}]`, objects),
      )
      .join(',')}]`;
  }

  if (value instanceof Date) {
    return `new Date(${value.getTime()})`;
  }

  if (value instanceof Set) {
    return `new Set(${uneval([...value], keys)})`;
  }

  if (value instanceof Map) {
    return `new Map(${uneval([...value], keys)})`;
  }

  return `{${Object.keys(value as Record<any, unknown>)
    .map(
      (key) =>
        `${JSON.stringify(key)}:${uneval(
          (value as Record<typeof key, unknown>)[key],
          !IS_DEV ? undefined : `${keys!}.${key}`,
        )}`,
    )
    .join(',')}}`;
}

// https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw
const UNSAFE_CHARS_REGEXP = /[/<>\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const escapeUnsafeChars = (unsafeChar: keyof typeof ESCAPED_CHARS): string =>
  ESCAPED_CHARS[unsafeChar];

export default function unevalValue(value: unknown): string {
  return uneval(value, !IS_DEV ? undefined : 'obj').replace(
    UNSAFE_CHARS_REGEXP,
    escapeUnsafeChars as (unsafeChar: string) => string,
  );
}
