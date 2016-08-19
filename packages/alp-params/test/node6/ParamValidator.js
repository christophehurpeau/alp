'use strict';

var _assert = require('assert');

var _ = require('../../');

/* global suite, test */
suite('param validator', () => {
  test('on init is valid', () => {
    const paramValidator = new _.ParamValidator();
    (0, _assert.strictEqual)(paramValidator.getErrors(), undefined);
    (0, _assert.strictEqual)(paramValidator.hasErrors(), false);
    (0, _assert.strictEqual)(paramValidator.isValid(), true);
  });

  test('has error', () => {
    const paramValidator = new _.ParamValidator();
    paramValidator._error('slug', 'notEmpty', '');
    (0, _assert.strictEqual)(paramValidator.hasErrors(), true);
    (0, _assert.strictEqual)(paramValidator.isValid(), false);
    (0, _assert.deepEqual)(paramValidator.getErrors(), { slug: { error: 'notEmpty', value: '' } });
  });

  test('.string() empty', () => {
    const paramValidator = new _.ParamValidator({
      param: name => ''
    });

    paramValidator.string('slug').notEmpty();
    (0, _assert.strictEqual)(paramValidator.hasErrors(), true);
    (0, _assert.strictEqual)(paramValidator.isValid(), false);
    (0, _assert.deepEqual)(paramValidator.getErrors(), { slug: { error: 'notEmpty', value: '' } });
  });

  test('.string() not empty', () => {
    const paramValidator = new _.ParamValidator({
      param: name => 'testValue'
    });

    paramValidator.string('slug').notEmpty();
    (0, _assert.strictEqual)(paramValidator.hasErrors(), false);
    (0, _assert.strictEqual)(paramValidator.isValid(), true);
    (0, _assert.strictEqual)(paramValidator.getErrors(), undefined);
  });
});
//# sourceMappingURL=ParamValidator.js.map