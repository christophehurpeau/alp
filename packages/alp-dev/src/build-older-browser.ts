import { createOlderBrowserCompiler } from './webpack/browser';

const browserCompiler = createOlderBrowserCompiler(
  process.env.NODE_ENV === 'production',
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
browserCompiler.run();
