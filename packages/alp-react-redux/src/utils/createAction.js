// eslint-disable-next-line flowtype/no-weak-types
type HandlerType = (...args: Array<any>) => Object;

export default (
  type: string,
  handler: ?HandlerType,
) => {
  const action = !handler ? (() => ({ type })) : ((...args) => ({ type, ...handler(...args) }));
  action.type = type;
  action.toString = () => type;
  return action;
};
