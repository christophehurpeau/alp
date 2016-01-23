import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MainLayout from './layouts/MainLayout';

class View1View extends Component {
    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        // const dispatch = this.context.context.store.dispatch;
        const title = 'View1';
        this.context.setTitle(title);
        return <MainLayout><div>View1</div></MainLayout>;
    }
}

export default connect((state) => ({
}))(View1View);
