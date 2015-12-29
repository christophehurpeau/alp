import { newController } from 'alp';
import IndexView from '../views/IndexView';
import helloApp from '../reducers/index';

export default newController({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(IndexView, helloApp, { name });
    },
});
