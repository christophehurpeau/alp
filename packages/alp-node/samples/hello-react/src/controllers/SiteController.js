import { newController } from 'alp';
import IndexView from '../views/IndexView';

export default newController({
    index: newController.action(function(request, response) {
        const name = request.params.string('name').notEmpty().value;
        return this.render(IndexView, { name });
    }),
});
