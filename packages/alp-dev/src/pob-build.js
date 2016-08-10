import { registerPlugin } from 'pob-babel';

export { clean, build, watch } from 'pob-babel';

registerPlugin(require('./pob-build-plugins/yml'));
