import { ParamValidationResult } from "./ParamValidationResult";

// const createContextMock = (): Context &
//   Record<
//     'namedParam' | 'otherParam' | 'param' | 'paramGET' | 'paramGETorPOST',
//     ReturnType<typeof jest.fn>
//   > => {
//   return {
//     state: {} as ContextState,
//     sanitizedState: {} as ContextSanitizedState,
//     param: jest.fn(),
//     namedParam: jest.fn(),
//     otherParam: jest.fn(),
//     paramGET: jest.fn(),
//     paramGETorPOST: jest.fn(),
//   } as unknown as Context &
//     Record<
//       'namedParam' | 'otherParam' | 'param' | 'paramGET' | 'paramGETorPOST',
//       ReturnType<typeof jest.fn>
//     >;
// };

test("on init is valid", () => {
  const paramValidator = new ParamValidationResult();
  expect(paramValidator.getErrors()).toBe(undefined);
  expect(paramValidator.hasErrors()).toBe(false);
  expect(paramValidator.isValid()).toBe(true);
});

test("has error", () => {
  const paramValidator = new ParamValidationResult();
  paramValidator._error("slug", "notEmpty", "");
  expect(paramValidator.hasErrors()).toBe(true);
  expect(paramValidator.isValid()).toBe(false);
  expect(paramValidator.getErrors()).toEqual({
    slug: { error: "notEmpty", value: "" },
  });
});

// test('.string() empty', () => {
//   const contextMock = createContextMock();
//   contextMock.param.mockReturnValue('');

//   const paramValidator = new ParamValidationResult(contextMock);

//   paramValidator.string('slug').notEmpty();
//   expect(contextMock.param).toHaveBeenNthCalledWith(1, 'slug');
//   expect(paramValidator.hasErrors()).toBe(true);
//   expect(paramValidator.isValid()).toBe(false);
//   expect(paramValidator.getErrors()).toEqual({
//     slug: { error: 'notEmpty', value: '' },
//   });
// });

// test('.string() not empty', () => {
//   const contextMock = createContextMock();
//   contextMock.param.mockReturnValue('testValue');
//   const paramValidator = new ParamValidationResult(contextMock);

//   paramValidator.string('slug').notEmpty();
//   expect(contextMock.param).toHaveBeenNthCalledWith(1, 'slug');
//   expect(paramValidator.hasErrors()).toBe(false);
//   expect(paramValidator.isValid()).toBe(true);
//   expect(paramValidator.getErrors()).toBe(undefined);
// });
