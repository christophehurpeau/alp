import newController from 'alp-controller';
import * as appDescriptor from '../views/index';

export default newController({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(appDescriptor, { name });
    },
});
