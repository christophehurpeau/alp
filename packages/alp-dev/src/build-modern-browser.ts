import { createModernBrowserCompiler } from './webpack/browser';

const browserCompiler = createModernBrowserCompiler(
  process.env.NODE_ENV === 'production',
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
browserCompiler.run();
