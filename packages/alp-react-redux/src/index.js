import render from 'fody';
import DefaultApp from 'fody-app';
import ReduxApp from 'fody-redux-app';
import { createStore } from 'redux';

export default function aukReactRedux(Html) {
    return (app) => {
        app.context.render = function (moduleDescriptor, data) {
            if (moduleDescriptor.reducer) {
                this.store = createStore(moduleDescriptor.reducer, data);
            }

            this.body = render({
                htmlData: {
                    context: this,
                    moduleDescriptor,
                },
                context: this,
                View: moduleDescriptor.View,
                initialData: moduleDescriptor.reducer ? () => this.store.getState() : () => null,
                Html,
                App: moduleDescriptor.reducer ? ReduxApp : DefaultApp,
            });
        };
    };
}
