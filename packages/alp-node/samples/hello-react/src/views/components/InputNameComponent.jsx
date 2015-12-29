import React, { Component, PropTypes } from 'react';

export default class InputNameComponent extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        setName: PropTypes.func.isRequired,
    };

    render() {
        const { name, setName } = this.props;
        return <input autoComplete="off" type="text" defaultValue={name} onKeyUp={e => setName(e.target.value)}></input>;
    }
}
