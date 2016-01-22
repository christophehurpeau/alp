import render from 'fody';
import App from 'fody-redux';
import { createStore } from 'redux';

export default function aukReactRedux(Html) {
    return (app) => {
        app.context.render = function (View, reducers, data) {
            this.store = createStore(reducers, data);
            this.body = render({
                context: this,
                View,
                initialData: () => this.store.getState(),
                Html,
                App,
            });
        };
    };
}
