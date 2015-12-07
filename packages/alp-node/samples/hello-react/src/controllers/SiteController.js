import { newController } from 'alp';
import IndexView from '../views/IndexView';

export default newController({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(IndexView, { name });
    },
});
