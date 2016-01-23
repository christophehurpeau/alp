import { newController } from 'alp';
import View1View from '../views/View1View';
import View2View from '../views/View2View';
import myApp from '../reducers/index';

export default newController({
    index(ctx) {
        return ctx.redirect(ctx.urlGenerator('default', { action: 'view1' }));
    },

    view1(ctx) {
        return ctx.render(View1View, myApp);
    },

    view2(ctx) {
        return ctx.render(View2View, myApp);
    },
});
