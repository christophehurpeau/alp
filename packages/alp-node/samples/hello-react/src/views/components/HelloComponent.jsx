import React, { Component, PropTypes } from 'react';
import InputName from './InputNameComponent';

export default class HelloComponent extends Component {
    static contextTypes = {
        context: PropTypes.object.isRequired,
    };

    static propTypes = {
        name: PropTypes.string.isRequired,
        setName: PropTypes.func.isRequired,
    };

    render() {
        const { name, setName } = this.props;
        return <div>
            <span>{ this.context.context.t('Hello {0}!', name || 'World') }</span>
            <InputName name={name} setName={setName} />
        </div>;
    }
}
