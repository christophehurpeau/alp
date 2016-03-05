import render from 'fody';
import DefaultApp from 'fody/lib/App';
import ReduxApp from 'fody-redux';
import { createStore } from 'redux';

export default function aukReactRedux(Html) {
    return (app) => {
        app.context.render = function (appDescriptor, data) {
            if (appDescriptor.app) {
                this.store = createStore(appDescriptor.app, data);
            }

            this.body = render({
                htmlData: {
                    context: this,
                    appDescriptor,
                },
                context: this,
                View: appDescriptor.View,
                initialData: appDescriptor.app ? () => this.store.getState() : () => null,
                Html,
                App: appDescriptor.app ? ReduxApp : DefaultApp,
            });
        };
    };
}
