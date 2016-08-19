/* global suite, test */
import { strictEqual, deepEqual } from 'assert';
import { ParamValidator } from '../../';

suite('param validator', () => {
  test('on init is valid', () => {
    const paramValidator = new ParamValidator();
    strictEqual(paramValidator.getErrors(), undefined);
    strictEqual(paramValidator.hasErrors(), false);
    strictEqual(paramValidator.isValid(), true);
  });


  test('has error', () => {
    const paramValidator = new ParamValidator();
    paramValidator._error('slug', 'notEmpty', '');
    strictEqual(paramValidator.hasErrors(), true);
    strictEqual(paramValidator.isValid(), false);
    deepEqual(paramValidator.getErrors(), { slug: { error: 'notEmpty', value: '' } });
  });

  test('.string() empty', () => {
    const paramValidator = new ParamValidator({
      param: (name) => '',
    });

    paramValidator.string('slug').notEmpty();
    strictEqual(paramValidator.hasErrors(), true);
    strictEqual(paramValidator.isValid(), false);
    deepEqual(paramValidator.getErrors(), { slug: { error: 'notEmpty', value: '' } });
  });

  test('.string() not empty', () => {
    const paramValidator = new ParamValidator({
      param: (name) => 'testValue',
    });

    paramValidator.string('slug').notEmpty();
    strictEqual(paramValidator.hasErrors(), false);
    strictEqual(paramValidator.isValid(), true);
    strictEqual(paramValidator.getErrors(), undefined);
  });
});
