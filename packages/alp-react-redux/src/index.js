import render from 'fody';
import App from 'fody-redux';
import { createStore } from 'redux';

export default function aukReactRedux(Html) {
    return (app) => {
        app.context.render = function (Component, reducers, data) {
            this.store = createStore(reducers, data);
            this.body = render({
                context: this,
                Component,
                initialData: () => this.store.getState(),
                Html,
                App,
            });
        };
    };
}
