import { Component } from 'turaco';

export default class InputNameComponent extends Component {
    elements = [
        'input',
    ];

    init({ name }) {
        this.name = name || '';
    }

    render() {
        return this.$input = <input autocomplete="off" type="text" value={this.name}></input>;
    }

    ready() {
        this.$input.on('keyup', e => {
            const newName = e.$element.getValue();
            if (this.name != newName) {
                this.name = newName;
                this.emit('nameChanged', newName);
            }
        });
    }
}
