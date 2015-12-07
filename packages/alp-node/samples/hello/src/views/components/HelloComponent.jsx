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
        const hello = this.t('Hello %s!', name || 'World');
        this.$container
            .append(this.$span =  <span>{hello}</span>)
            .append(this.input = <InputName name={name} />);
    }

    ready() {
        console.log('hello ready');
        this.input.on('nameChanged', (newName) => {
            this.setName(newName);
        });
    }

    setName(name) {
        this.$span.text(name);
    }
}
