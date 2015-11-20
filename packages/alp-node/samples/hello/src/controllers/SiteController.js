import { newController } from 'alp';
import TuracoView from '../views/TuracoView';

export default newController({
    index: newController.action(function(request, response) {
        const name = request.params.string('name').notEmpty().value;
        return response.end(this.t('Hello %s!', request.params.isValid() ? name : 'World'));
    }),

    turaco: newController.action(function(request, response) {
        const name = request.params.string('name').notEmpty().value;
        return this.render(TuracoView);
    }),
});
