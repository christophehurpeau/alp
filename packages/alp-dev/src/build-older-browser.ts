import { createOlderBrowserCompiler } from './webpack/browser';

const browserCompiler = createOlderBrowserCompiler(
  process.env.NODE_ENV !== 'development',
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
browserCompiler.run();
