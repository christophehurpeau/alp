'use strict';

module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: (pkg) => {
      if (pkg.type === 'module') {
        return pkg;
      }

      if (pkg.exports?.['.']?.import) {
        if (pkg.exports['.'].require) {
          pkg.exports['.'].default = pkg.exports['.'].require;
        }
        delete pkg.exports['.'].import;
      }

      return pkg;
    },
  });
};
