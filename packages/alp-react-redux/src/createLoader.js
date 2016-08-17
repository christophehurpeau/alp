/* global PRODUCTION */
export default function createLoader(defaultState: Function|Object, handlers: ?Object) {
    if (typeof defaultState === 'object') {
        handlers = defaultState;
        defaultState = () => ({});
    }

    const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
    handlers = undefined;

    return (state = defaultState(), data) => {
        const keys = Object.keys(data);
        return Promise.all(keys.map(key => {
            const handler = handlerMap.get(key);
            if (!PRODUCTION && !handler) throw new Error(`Missing handler for "${key}".`);
            return handler(state, keys[key]);
        })).then(results => {
            results.forEach((result, index) => {
                state[keys[index]] = result;
            });
            return state;
        });
    };
}
