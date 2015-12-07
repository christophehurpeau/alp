import React, { Component, PropTypes } from 'react';

export default class IndexView extends Component {
    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired,
    };

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        const title = 'React Index View';
        this.context.setTitle(title);
        const name = this.props.name;
        return (<div>{this.context.t('Hello %s!', name || 'World')}</div>);
    }
}
