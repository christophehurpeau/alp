import { PropTypes } from 'react';
import InputName from './InputNameComponent';

HelloComponent.contextTypes = {
    context: PropTypes.object.isRequired,
};

HelloComponent.propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
};

export default function HelloComponent({ name, setName }, { context }) {
    return (<div className="hello-component">
        <div className="hello-name">{context.t('Hello {name}!', { name: name || 'World' })}</div>
        <InputName name={name} setName={setName} />
    </div>);
}
