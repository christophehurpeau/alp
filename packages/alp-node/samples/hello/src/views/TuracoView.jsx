import View from 'turaco/lib/View';
import Layout from './layouts/Layout';

export default class TuracoView extends View {
    constructor() {
        super();
        this.title = 'Turaco View';
        this.parent = Layout;
    }

    render({ name }) {
        return (<div>{this.t('Hello %s!', name || 'World')}</div>);
    }
}
