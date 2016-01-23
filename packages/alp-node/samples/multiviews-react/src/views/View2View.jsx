import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MainLayout from './layouts/MainLayout';

class View2View extends Component {
    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        // const dispatch = this.context.context.store.dispatch;
        const title = 'View2';
        this.context.setTitle(title);
        return <MainLayout><div>View2</div></MainLayout>;
    }
}

export default connect((state) => ({
}))(View2View);
