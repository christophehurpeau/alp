import { registerPlugin, clean as _clean, build as _build, watch as _watch } from 'pob-babel';

registerPlugin(require('./pob-build-plugins/yml'));
registerPlugin(require('./pob-build-plugins/stylus'));

const options = {
  babelExtensions: ['.js', '.jsx'],
};

export const clean = (envs) => _clean(envs);
export const build = (envs) => _build(envs, options);
export const watch = (envs) => _watch(envs, options);

