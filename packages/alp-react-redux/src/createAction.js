export default function createAction(type: string, argsNames: ?Array<string>) {
    const action =
        argsNames ?
            function (...args) {
                const action = { type };
                args.forEach((value, index) => action[argsNames[index]] = value);
                return action;
            }
            : function (args) { return { type, ...args }; };

    action.type = type;
    action.toString = () => type;

    return action;
}
