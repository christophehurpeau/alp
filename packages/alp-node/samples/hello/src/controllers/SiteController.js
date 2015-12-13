import { newController } from 'alp';
import TuracoView from '../views/TuracoView';

export default newController({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        ctx.body = ctx.t('Hello {0}!', ctx.params.isValid() ? name : 'World');
    },

    turaco(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(TuracoView, null, { name });
    },
});
