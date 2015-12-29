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
        const dispatch = this.context.context.store.dispatch;
        const title = 'Hello ' + name;
        this.context.setTitle(title);
        return (<Hello name={name} setName={name => dispatch(setName(name))}></Hello>);
    }
}

export default connect((state) => ({
    name: state.name,
}))(IndexView);
