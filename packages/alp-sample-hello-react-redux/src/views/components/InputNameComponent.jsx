import { PropTypes } from 'react';

InputNameComponent.propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
};

export default function InputNameComponent({ name, setName }) {
    return (<input
        autoComplete="off"
        type="text"
        defaultValue={name}
        onKeyUp={e => setName(e.target.value)}
        onChange={e => setName(e.target.value)}
    />);
}
