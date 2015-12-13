import { Component } from 'turaco';
import InputNameComponent from './InputNameComponent';

export default class HelloComponent extends Component {
    elements = [
        'span',
    ];

    components = [
        'input',
    ];

    render({ name }) {
        const InputName = this.component(InputNameComponent);
        this.$container
            .append(this.$span = <span></span>)
            .append(this.input = <InputName name={name} />);
        this.setName(name);
    }

    ready() {
        this.input.on('nameChanged', (newName) => {
            this.setName(newName);
        });
    }

    setName(name) {
        const hello = this.context.t('Hello {0}!', name || 'World');
        this.$span.text(hello);
    }
}
