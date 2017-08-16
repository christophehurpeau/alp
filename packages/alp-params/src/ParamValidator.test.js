import { ParamValidator } from '../index';

test('on init is valid', () => {
  const paramValidator = new ParamValidator();
  expect(paramValidator.getErrors()).toBe(undefined);
  expect(paramValidator.hasErrors()).toBe(false);
  expect(paramValidator.isValid()).toBe(true);
});

test('has error', () => {
  const paramValidator = new ParamValidator();
  paramValidator._error('slug', 'notEmpty', '');
  expect(paramValidator.hasErrors()).toBe(true);
  expect(paramValidator.isValid()).toBe(false);
  expect(paramValidator.getErrors()).toEqual({ slug: { error: 'notEmpty', value: '' } });
});

test('.string() empty', () => {
  const paramValidator = new ParamValidator({
    param: name => '',
  });

  paramValidator.string('slug').notEmpty();
  expect(paramValidator.hasErrors()).toBe(true);
  expect(paramValidator.isValid()).toBe(false);
  expect(paramValidator.getErrors()).toEqual({ slug: { error: 'notEmpty', value: '' } });
});

test('.string() not empty', () => {
  const paramValidator = new ParamValidator({
    param: name => 'testValue',
  });

  paramValidator.string('slug').notEmpty();
  expect(paramValidator.hasErrors()).toBe(false);
  expect(paramValidator.isValid()).toBe(true);
  expect(paramValidator.getErrors()).toBe(undefined);
});
