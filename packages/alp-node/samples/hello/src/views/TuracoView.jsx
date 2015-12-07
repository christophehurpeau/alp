import { View } from 'turaco';
import Layout from './layouts/Layout';
import HelloComponent from './components/HelloComponent';

export default class TuracoView extends View {
    parent = Layout;

    render({ name }) {
        this.title = 'Turaco View';
        this.$container
            .append(this.component(HelloComponent)(null, { name }));
    }
}
