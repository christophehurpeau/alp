import ParamValidator from './ParamValidator';

test('on init is valid', () => {
  const contextMock = {};
  const paramValidator = new ParamValidator(contextMock);
  expect(paramValidator.getErrors()).toBe(undefined);
  expect(paramValidator.hasErrors()).toBe(false);
  expect(paramValidator.isValid()).toBe(true);
});

test('has error', () => {
  const contextMock = {};
  const paramValidator = new ParamValidator(contextMock);
  paramValidator._error('slug', 'notEmpty', '');
  expect(paramValidator.hasErrors()).toBe(true);
  expect(paramValidator.isValid()).toBe(false);
  expect(paramValidator.getErrors()).toEqual({
    slug: { error: 'notEmpty', value: '' },
  });
});

test('.string() empty', () => {
  const paramValidator = new ParamValidator({
    param: (name: any) => '',
  });

  paramValidator.string('slug').notEmpty();
  expect(paramValidator.hasErrors()).toBe(true);
  expect(paramValidator.isValid()).toBe(false);
  expect(paramValidator.getErrors()).toEqual({
    slug: { error: 'notEmpty', value: '' },
  });
});

test('.string() not empty', () => {
  const paramValidator = new ParamValidator({
    param: (name: any) => 'testValue',
  });

  paramValidator.string('slug').notEmpty();
  expect(paramValidator.hasErrors()).toBe(false);
  expect(paramValidator.isValid()).toBe(true);
  expect(paramValidator.getErrors()).toBe(undefined);
});
