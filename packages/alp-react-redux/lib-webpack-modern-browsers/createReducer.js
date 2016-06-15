export default function createReducer(defaultState, handlers) {
    var handlerMap = new Map();
    Object.keys(handlers).forEach(key => {
        if (typeof key === 'function') {
            if (typeof key.type !== 'string') {
                throw new Error(`Invalid handler key: "${ key.name }"`);
            }
            handlerMap.set(key.type, handlers[key]);
        } else {
            handlerMap.set(key, handlers[key]);
        }
    });

    return function () {
        var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
        var action = arguments[1];

        if (action && handlerMap.has(action.type)) {
            return handlerMap.get(action.type)(state, action);
        }

        return state;
    };
}
//# sourceMappingURL=createReducer.js.map