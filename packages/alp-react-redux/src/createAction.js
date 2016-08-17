export default function createAction(
    type:string,
    argsNamesOrHandler:?Array<string>|string|Function,
    data:?Object
) {
    let action;

    const typeofSecondArg = typeof argsNamesOrHandler;

    if (typeofSecondArg === 'function') {
        action = (...args) => ({ type, ...data, ...argsNamesOrHandler(...args) });
    } else {
        if (typeofSecondArg === 'string') {
            argsNamesOrHandler = argsNamesOrHandler.split(',');
        }

        if (argsNamesOrHandler) {
            action = (...args) => {
                const action = { type, ...data };
                args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
                return action;
            };
        } else {
            action = (args: ?Object) => ({ type, ...data, ...args });
        }
    }

    action.type = type;
    action.toString = () => type;

    return action;
}
