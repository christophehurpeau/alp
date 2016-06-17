export default function createAction(type: string, argsNamesOrHandler: ?Array<string>|string|Function) {
    let action;

    const typeofSecondArg = typeof argsNamesOrHandler;

    if (typeofSecondArg === 'function') {
        action = (...args) => ({ type, ...argsNamesOrHandler(...args) });
    } else {
        if (typeofSecondArg === 'string') {
            argsNamesOrHandler = argsNamesOrHandler.split(',');
        }

        if (argsNamesOrHandler) {
            action = (...args) => {
                const action = { type };
                args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
                return action;
            };
        } else {
            action = (args: ?Object) => ({ type, ...args });
        }
    }

    action.type = type;
    action.toString = () => type;

    return action;
}
