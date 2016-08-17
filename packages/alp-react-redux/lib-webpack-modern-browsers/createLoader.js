/* global PRODUCTION */
export default function createLoader(defaultState, handlers) {
    if (typeof defaultState === 'object') {
        handlers = defaultState;
        defaultState = () => ({});
    }

    var handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
    handlers = undefined;

    return function () {
        var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
        var data = arguments[1];

        var keys = Object.keys(data);
        return Promise.all(keys.map(key => {
            var handler = handlerMap.get(key);

            return handler(state, data[key]);
        })).then(results => {
            results.forEach((result, index) => {
                state[keys[index]] = result;
            });
            return state;
        });
    };
}
//# sourceMappingURL=createLoader.js.map