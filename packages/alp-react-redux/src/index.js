import render from 'fody';
import App from 'fody-redux';
import { createStore } from 'redux';

export default function aukReactRedux(Html) {
    return (app) => {
        app.context.render = function (appDescriptor, data) {
            this.store = createStore(appDescriptor.app, data);
            this.body = render({
                htmlData: {
                    context: this,
                    appDescriptor,
                },
                context: this,
                View: appDescriptor.View,
                initialData: () => this.store.getState(),
                Html,
                App,
            });
        };
    };
}
