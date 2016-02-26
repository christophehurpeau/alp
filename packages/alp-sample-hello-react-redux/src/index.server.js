import Auk from 'auk';
import reactredux from 'auk-react-redux';
import routerBuilder from './routerBuilder';
import Html from './views/layouts/Html';
import controllers from './controllers';

const app = new Auk(__dirname);
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
