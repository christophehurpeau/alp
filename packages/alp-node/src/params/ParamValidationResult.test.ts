import assert from "node:assert/strict";
import { test } from "node:test";
// eslint-disable-next-line import/extensions
import { ParamValidationResult } from "./ParamValidationResult.ts";

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
  assert.equal(paramValidator.getErrors(), undefined);
  assert.equal(paramValidator.hasErrors(), false);
  assert.equal(paramValidator.isValid(), true);
});

test("has error", () => {
  const paramValidator = new ParamValidationResult();
  paramValidator._error("slug", "notEmpty", "");
  assert.equal(paramValidator.hasErrors(), true);
  assert.equal(paramValidator.isValid(), false);
  assert.deepEqual(paramValidator.getErrors(), {
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
