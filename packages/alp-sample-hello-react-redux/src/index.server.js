import Alp from 'alp';
import reactredux from 'alp-react-redux';
import routerBuilder from './routerBuilder';
import Html from './views/layouts/Html';
import controllers from './controllers';

const app = new Alp(__dirname);
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
