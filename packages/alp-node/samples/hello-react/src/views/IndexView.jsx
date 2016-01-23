import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Hello from './components/HelloComponent';
import { setName } from '../actions/name'

class IndexView extends Component {
    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        const { name } = this.props;
        const title = 'Hello ' + name;
        this.context.setTitle(title);
        return (<Hello name={name} setName={name => this.setName(name)}></Hello>);
    }

    setName(name) {
        const dispatch = this.context.context.store.dispatch;
        dispatch(setName(name));
    }

    componentDidMount() {
        const store = this.context.context.store;
        store.subscribe(this._storeListener = () => {
            const state = store.getState();

            const queryParams = new URLSearchParams(!location.search.length ? location.search : location.search.substr(1));
            if (!state.name) {
                queryParams.delete('name');
            } else {
                queryParams.set('name', state.name);
            }

            const queryString = queryParams.toString();
            if (queryString !== location.query) {
                history.replaceState(
                    { name: state.name },
                    document.title,
                    (location.pathname.slice(0, -(location.search.length - 1)) || '/')
                        + (queryString && '?' + queryString)
                );
            }
        });
    }

    componentWillUnmount() {
        const store = this.context.context.store;
        if (this._storeListener) {
            store.unsubscribe(this._storeListener);
        }
    }
}

export default connect((state) => ({
    name: state.name,
}))(IndexView);
